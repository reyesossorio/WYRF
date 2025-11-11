import React, { useState, useEffect } from 'react';
import DaySquare from './DaySquare';
import { getFeelings, saveFeeling } from '../services/api';
import './YearGrid.css';

const YearGrid = () => {
  const [feelings, setFeelings] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const feelingOptions = [
    { name: 'happy', label: 'Happy' },
    { name: 'normal', label: 'Normal' },
    { name: 'sad', label: 'Sad' }
  ];
  const getYearDatesByMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const months = [];

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const monthDates = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const monthStr = String(month + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${year}-${monthStr}-${dayStr}`;
        monthDates.push(dateStr);
      }

      months.push({
        name: monthNames[month],
        dates: monthDates
      });
    }

    return months;
  };

  const yearMonths = getYearDatesByMonth();

  const isFutureDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr + 'T00:00:00');
    return date > today;
  };

  useEffect(() => {
    loadFeelings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedDate && !event.target.closest('.feeling-selector-bottom') && !event.target.closest('.day-square')) {
        setSelectedDate(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedDate]);

  const loadFeelings = async () => {
    try {
      setLoading(true);
      const data = await getFeelings();

      const feelingsMap = {};
      data.forEach(item => {
        feelingsMap[item.date] = item.feeling;
      });

      setFeelings(feelingsMap);
      setError(null);
    } catch (err) {
      setError('Failed to load feelings. Make sure the backend server is running.');
      console.error('Error loading feelings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDayClick = (date) => {
    if (isFutureDate(date)) return;
    setSelectedDate(date);
  };

  const handleSaveFeeling = async (feeling) => {
    if (!selectedDate) return;

    try {
      await saveFeeling(selectedDate, feeling);

      setFeelings(prev => ({
        ...prev,
        [selectedDate]: feeling
      }));

      setSelectedDate(null);
    } catch (err) {
      setError('Failed to save feeling. Please try again.');
      console.error('Error saving feeling:', err);
    }
  };

  if (loading) {
    return <div className="year-grid-container loading-state">Loading your year...</div>;
  }

  if (error) {
    return (
      <div className="year-grid-container error-state">
        <p className="error-message">{error}</p>
        <button onClick={loadFeelings} className="retry-button">Retry</button>
      </div>
    );
  }

  const selectedFeeling = selectedDate ? feelings[selectedDate] : null;
  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : null;
  const formatSelectedDate = selectedDateObj
    ? selectedDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div className="year-grid-container">
      <h1 className="app-title">Whatever you're feeling</h1>

      <div className="year-grid">
        {yearMonths.map((month, monthIndex) => (
          <div key={monthIndex} className="month-row">
            <div className="month-days">
              {month.dates.map((date, dayIndex) => {
                const globalIndex = yearMonths
                  .slice(0, monthIndex)
                  .reduce((sum, m) => sum + m.dates.length, 0) + dayIndex;

                return (
                  <DaySquare
                    key={date}
                    date={date}
                    feeling={feelings[date]}
                    isSelected={date === selectedDate}
                    isFuture={isFutureDate(date)}
                    onClick={() => handleDayClick(date)}
                    animationIndex={globalIndex}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="feeling-selector-bottom">
          <div className="selected-date-info">
            <h3>{formatSelectedDate}</h3>
            {selectedFeeling && (
              <p className="current-feeling">
                Current feeling: <span className="feeling-label">{feelingOptions.find(f => f.name === selectedFeeling)?.label}</span>
              </p>
            )}
          </div>
          <div className="feeling-options">
            {feelingOptions.map(option => (
              <button
                key={option.name}
                className={`feeling-button ${option.name} ${selectedFeeling === option.name ? 'selected' : ''}`}
                onClick={() => handleSaveFeeling(option.name)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearGrid;
