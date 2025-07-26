import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { STSClient } from "./sts";

export class BedrockClient extends STSClient {
  private bedrockClient: BedrockRuntimeClient;

  constructor(accessKey: string, secretKey: string, region: string) {
    super(accessKey, secretKey, region);

    this.bedrockClient = new BedrockRuntimeClient({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });
  }

  getBedrockClient() {
    return this.bedrockClient;
  }
}
