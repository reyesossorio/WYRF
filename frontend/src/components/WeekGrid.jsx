import React, { useState, useEffect } from 'react';
import FeelingCell from './FeelingCell';
import { getFeelings, saveFeeling } from '../services/api';
import './WeekGrid.css';

const WeekGrid = () => {
  const [feelings, setFeelings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate array of dates for current week (last 7 days including today)
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      dates.push(dateStr);
    }

    return dates;
  };

  const weekDates = getWeekDates();

  // Load feelings from API
  useEffect(() => {
    loadFeelings();
  }, []);

  const loadFeelings = async () => {
    try {
      setLoading(true);
      const data = await getFeelings();

      // Convert array to object with date as key
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

  const handleSaveFeeling = async (date, feeling) => {
    try {
      await saveFeeling(date, feeling);

      // Update local state
      setFeelings(prev => ({
        ...prev,
        [date]: feeling
      }));
    } catch (err) {
      setError('Failed to save feeling. Please try again.');
      console.error('Error saving feeling:', err);
      throw err; // Re-throw to let FeelingCell handle it
    }
  };

  if (loading) {
    return <div className="week-grid-container loading-state">Loading your week...</div>;
  }

  if (error) {
    return (
      <div className="week-grid-container error-state">
        <p className="error-message">{error}</p>
        <button onClick={loadFeelings} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="week-grid-container">
      <h1 className="app-title">How Are You Feeling?</h1>
      <p className="app-subtitle">Track your feelings throughout the week</p>

      <div className="week-grid">
        {weekDates.map(date => (
          <FeelingCell
            key={date}
            date={date}
            feeling={feelings[date]}
            onSaveFeeling={handleSaveFeeling}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekGrid;
