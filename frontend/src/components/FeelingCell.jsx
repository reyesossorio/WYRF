import React, { useState } from 'react';
import FeelingSelector from './FeelingSelector';
import './FeelingCell.css';

const FeelingCell = ({ date, feeling, onSaveFeeling }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getFeelingEmoji = (feelingType) => {
    const emojis = {
      happy: '😊',
      normal: '😐',
      sad: '😢'
    };
    return emojis[feelingType] || '○';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      day: days[date.getDay()],
      date: date.getDate()
    };
  };

  const handleFeelingSelect = async (feelingType) => {
    setIsLoading(true);
    try {
      await onSaveFeeling(date, feelingType);
      setShowSelector(false);
    } catch (error) {
      console.error('Error saving feeling:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dateInfo = formatDate(date);

  return (
    <div className="feeling-cell">
      <div className="date-header">
        <div className="day-name">{dateInfo.day}</div>
        <div className="day-number">{dateInfo.date}</div>
      </div>
      <div
        className={`feeling-display ${feeling ? 'has-feeling' : ''} ${isLoading ? 'loading' : ''}`}
        onClick={() => !isLoading && setShowSelector(!showSelector)}
      >
        <span className="feeling-emoji-large">
          {isLoading ? '⏳' : getFeelingEmoji(feeling)}
        </span>
      </div>
      {showSelector && !isLoading && (
        <div className="selector-popup">
          <FeelingSelector
            currentFeeling={feeling}
            onFeelingSelect={handleFeelingSelect}
          />
        </div>
      )}
    </div>
  );
};

export default FeelingCell;
