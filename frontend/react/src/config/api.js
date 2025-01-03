// API設定
export const API_CONFIG = {
    LAMBDA_URL: "https://4gmpq53ii5gl6tn4t7dphedoky0rrnlv.lambda-url.ap-northeast-1.on.aws/",
    ENDPOINT: "api/stream_graph",
    get API_URL() {
      return `${this.LAMBDA_URL}${this.ENDPOINT}`;
    },
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream'
    }
  };
