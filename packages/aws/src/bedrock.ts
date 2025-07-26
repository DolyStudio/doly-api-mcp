import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import dotenv from "dotenv";
import { STSClient } from "./sts";
dotenv.config();

type BedrockModelType = "amazon.nova-micro-v1:0";

/**
 * @temperature
 * 0 에 가까울수록 정형화된 답변 (정답에 가까움)
 * 1 에 가까울수록 자유료운 답변이 가능 (정답에 멀어질 수도 있음)
 */
type BedrockConfigParams = {
  modelId: BedrockModelType;
  messageLimit: number;
  maxTokens: number;
  temperature: 0.5;
  timeout: number;
};

type ChatMessageParams = {
  role: "user" | "assistant" | "system";
  content: string;
  timeStamp: Date;
};

type ChatSessionParams = {
  sessionId: string;
  messages: ChatMessageParams[];
  createdAt: Date;
  lastActivity?: Date;
};

class BedrockClient extends STSClient {
  private bedrockClient: BedrockRuntimeClient;
  private config: BedrockConfigParams;
  private basePrompt: string;

  private chatSession: Map<string, ChatSessionParams> = new Map();

  constructor(accessKey: string, secretKey: string, region: string) {
    super(accessKey, secretKey, region);

    this.bedrockClient = new BedrockRuntimeClient({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });

    this.config = {
      modelId: "amazon.nova-micro-v1:0",
      maxTokens: 1000,
      temperature: 0.5,
      messageLimit: 20,
      timeout: 3600,
    };

    this.basePrompt =
      "당신은 도움이 되는 AI 어시스턴트입니다. 친근하고 정확한 답변을 제공해주세요.";
  }

  setModelConfig(model: Partial<BedrockConfigParams>): this {
    this.config.modelId = model.modelId ?? "amazon.nova-micro-v1:0";
    this.config.maxTokens = model.maxTokens ?? 1000;
    this.config.temperature = model.temperature ?? 0.5;
    this.config.messageLimit = model.messageLimit ?? 20;
    this.config.timeout = model.timeout ?? 3600;
    return this;
  }

  setDefaultPrompt(prompt: string): this {
    this.basePrompt = prompt;
    return this;
  }

  getSession(sessionId: string): ChatSessionParams {
    const now = new Date();

    const session = this.chatSession.get(sessionId);
    if (!session) {
      console.log(`${sessionId} is new generate`);
      this.chatSession.set(sessionId, {
        sessionId,
        messages: [
          {
            role: "system",
            content: this.basePrompt,
            timeStamp: now,
          },
        ],
        createdAt: now,
      });
    }

    session!.lastActivity = now;
    return this.chatSession.get(sessionId) as ChatSessionParams;
  }

  async createCommunication(
    sessionId: string,
    params: ChatMessageParams
  ): Promise<ChatSessionParams> {
    // 사용자 질문을 넣는다
    let session = this.getSession(sessionId);
    session.messages.push(params);

    // 답변을 받는다.
    const answer = await this.generateMessage(session.messages);

    // 답변도 넣는다.
    session.messages.push({
      role: "assistant",
      content: answer,
      timeStamp: new Date(),
    });

    session = this.cleanSessionMessage(session);
    session = this.cleanSessionTimeout(session);

    // print debug
    console.log(JSON.stringify(session, null, 4));
    return session;
  }

  private async generateMessage(
    messages: ChatMessageParams[]
  ): Promise<string> {
    try {
      const UserMessage = messages
        .filter((it) => it.role !== "system")
        .map((it) => ({
          role: it.role,
          content: it.content,
        }));

      const paylod = {
        messages: UserMessage,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        top_p: 0.9,
      };

      const cmd = new InvokeModelCommand({
        modelId: this.config.modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(paylod),
      });

      const response = await this.bedrockClient.send(cmd);
      const body = JSON.parse(new TextDecoder().decode(response.body));

      if (body.output && body.output.message) {
        return body.output.message.content;
      }

      throw new Error("Parsing Error");
    } catch (e) {
      console.error(e);
      return "";
    }
  }

  getActiveSession(): number {
    return this.chatSession.size;
  }

  /**
   * @desc 메시지가 너무 많으면 시스템로그[0] 제외한 다음번 지우기...
   */
  private cleanSessionMessage(session: ChatSessionParams): ChatSessionParams {
    if (session.messages.length > this.config.messageLimit) {
      console.log(
        `session : ${session.sessionId} ${session.messages.length} messages is too many, clean message -1`
      );

      const systemMessage = session.messages[0];
      session.messages = [
        systemMessage,
        ...session.messages.slice(-this.config.messageLimit),
      ];
    }

    return session;
  }

  /**
   * @desc 세션 타임아웃 체크 (1 hour)
   */
  private cleanSessionTimeout(session: ChatSessionParams): ChatSessionParams {
    for (const [sessionId, session] of this.chatSession.entries()) {
      if (
        session.lastActivity &&
        session.lastActivity.getTime() + this.config.timeout < Date.now()
      ) {
        console.log(`session : ${sessionId} timeout`);
        this.chatSession.delete(sessionId);
      }
    }

    return session;
  }
}

export const bedrock = new BedrockClient(
  process.env.AWS_ACCESS_KEY_ID ?? "",
  process.env.AWS_SECRET_ACCESS_KEY ?? "",
  process.env.AWS_REGION ?? ""
);
