export class STSClient {
  constructor(
    protected readonly accessKey: string,
    protected readonly secretKey: string,
    protected readonly region = "ap-northeast-2"
  ) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.region = region;
  }
}
