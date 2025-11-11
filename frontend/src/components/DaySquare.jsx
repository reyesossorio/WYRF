import React from 'react';
import './DaySquare.css';

const DaySquare = ({ date, feeling, isSelected, isFuture, onClick, animationIndex }) => {
  const getFeelingClass = () => {
    if (isFuture) {
      return 'future-day';
    }
    if (feeling) {
      return `feeling-${feeling}`;
    }
    return 'no-feeling';
  };

  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const animationDelay = `${animationIndex * 4}ms`;

  return (
    <div
      className={`day-square ${getFeelingClass()} ${isSelected ? 'selected' : ''} ${isFuture ? 'disabled' : ''} day-square-animate`}
      onClick={onClick}
      title={formatDate(date)}
      style={{ animationDelay }}
    />
  );
};

export default DaySquare;
