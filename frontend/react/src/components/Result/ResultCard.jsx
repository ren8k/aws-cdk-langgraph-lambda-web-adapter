import React from 'react';
import '../../styles/components/ResultCard.css';

const ResultCard = ({ title, content, emoji, isTargetAudience }) => (
  <div className="result-card">
    <h2 className="result-title">{emoji} {title}</h2>
    <div className={isTargetAudience ? 'target-audience-content' : 'result-content'}>
      <p>{content}</p>
    </div>
  </div>
);

export default ResultCard;
