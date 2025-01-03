// API設定
export const API_CONFIG = {
    LAMBDA_URL: "https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXX.lambda-url.ap-northeast-1.on.aws/",
    ENDPOINT: "api/stream_graph",
    get API_URL() {
      return `${this.LAMBDA_URL}${this.ENDPOINT}`;
    },
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream'
    }
  };
