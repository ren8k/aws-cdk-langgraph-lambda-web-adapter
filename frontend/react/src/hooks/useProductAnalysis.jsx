import { useState } from 'react';
import { API_CONFIG } from '../config/api';

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

export default useProductAnalysis;
