import { useState } from 'react';
import './App.css';

// API設定
const API_CONFIG = {
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

// カスタムフック: APIとの通信を管理
const useProductAnalysis = () => {
  const [copy, setCopy] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeProduct = async (productDetail) => {
    setIsLoading(true);
    setCopy('');
    setTargetAudience('');
    setError(null);

    try {
      const response = await fetch(API_CONFIG.API_URL, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        credentials: 'omit',
        mode: 'cors',
        body: JSON.stringify({ product_detail: productDetail })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await processStream(response.body.getReader());
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ストリーム処理
  const processStream = async (reader) => {
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          processBuffer(buffer);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        lines.forEach(line => processBuffer(line));
      }
    } catch (error) {
      console.error('Stream processing error:', error);
      throw error;
    }
  };

  // 個々のJSONデータを処理
  const processBuffer = (buffer) => {
    if (!buffer.trim()) return;

    try {
      const data = JSON.parse(buffer);
      if (data.copy) setCopy(data.copy);
      if (data.target_audience) setTargetAudience(data.target_audience);
    } catch (error) {
      console.error('JSON parsing error:', error);
    }
  };

  return {
    copy,
    targetAudience,
    isLoading,
    error,
    analyzeProduct
  };
};

// 結果表示用コンポーネント
const ResultCard = ({ title, content, emoji, isTargetAudience }) => (
  <div className="result-card">
    <h2 className="result-title">{emoji} {title}</h2>
    <div className={isTargetAudience ? 'target-audience-content' : 'result-content'}>
      <p>{content}</p>
    </div>
  </div>
);

// メインコンポーネント
const App = () => {
  const [productDetail, setProductDetail] = useState('');
  const {
    copy,
    targetAudience,
    isLoading,
    error,
    analyzeProduct
  } = useProductAnalysis();

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeProduct(productDetail);
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">商品広告生成アプリ</h1>
        <h2 className="subtitle">商品詳細</h2>

        <form onSubmit={handleSubmit} className="form">
          <textarea
            value={productDetail}
            onChange={(e) => setProductDetail(e.target.value)}
            className="textarea"
            rows={4}
            placeholder="例: ラベンダーとベルガモットのやさしい香りが特徴の保湿クリームで、ヒアルロン酸とシアバターの配合により、乾燥肌に潤いを与えます。価格は50g入りで3,800円（税込）です。"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="button"
          >
            {isLoading ? '実行中...' : 'Agent 実行開始'}
          </button>
        </form>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {copy && (
          <ResultCard
            title="生成された広告文"
            content={copy}
            emoji="📝"
          />
        )}

        {targetAudience && (
          <ResultCard
            title="ターゲット層分析"
            content={targetAudience}
            emoji="🎯"
            isTargetAudience={true}
          />
        )}
      </div>
    </div>
  );
};

export default App;
