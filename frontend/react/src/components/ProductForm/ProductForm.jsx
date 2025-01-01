import React, { useState } from 'react';
import '../../styles/components/ProductForm.css';

const ProductForm = ({ onSubmit, isLoading }) => {
  const [productDetail, setProductDetail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(productDetail);
  };

  return (
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
  );
};

export default ProductForm;
