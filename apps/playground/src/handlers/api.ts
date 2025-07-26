import { bedrock } from "@repo/aws/index";
import { HTTPResponse } from "@repo/shared/index";

export const api = (req, res) => {
  const { sessionId, message } = req.body;

  const session = bedrock
    .setModelConfig({
      modelId: "amazon.nova-micro-v1:0",
      messageLimit: 10,
      maxTokens: 1000,
      temperature: 0.5,
      timeout: 10000,
    })
    .setDefaultPrompt(
      `
      너는 도움되는 AI 어시스턴트야, 최대한 친구처럼 친근하게 답변해줘
      그리고 진짜 친구처럼 농담도 섞어가면서 답변해주면 좋아
      `
    )
    .createCommunication(sessionId, {
      role: "user",
      content: message,
      timeStamp: new Date(),
    });

  return HTTPResponse(
    {
      status: 200,
      result: session,
      error: null,
    },
    res
  );
};
