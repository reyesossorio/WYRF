import React from 'react';
import './FeelingSelector.css';

const FeelingSelector = ({ currentFeeling, onFeelingSelect }) => {
  const feelings = [
    { type: 'happy', emoji: '😊', label: 'Happy' },
    { type: 'normal', emoji: '😐', label: 'Normal' },
    { type: 'sad', emoji: '😢', label: 'Sad' }
  ];

  return (
    <div className="feeling-selector">
      {feelings.map((feeling) => (
        <button
          key={feeling.type}
          className={`feeling-button ${currentFeeling === feeling.type ? 'selected' : ''}`}
          onClick={() => onFeelingSelect(feeling.type)}
          title={feeling.label}
        >
          <span className="feeling-emoji">{feeling.emoji}</span>
          <span className="feeling-label">{feeling.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FeelingSelector;
