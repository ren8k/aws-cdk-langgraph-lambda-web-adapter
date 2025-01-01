import React from 'react';
import useProductAnalysis from './hooks/useProductAnalysis';
import ProductForm from './components/ProductForm';
import ResultCard from './components/Result/ResultCard';
import './styles/components/App.css';

const App = () => {
  const {
    copy,
    targetAudience,
    isLoading,
    error,
    analyzeProduct
  } = useProductAnalysis();

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">商品広告生成アプリ</h1>
        <h2 className="subtitle">商品詳細</h2>

        <ProductForm
          onSubmit={analyzeProduct}
          isLoading={isLoading}
        />

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
