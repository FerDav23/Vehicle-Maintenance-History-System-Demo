import React from 'react';
import './TableStates.css';

export const NoData = () => {
  return (
    <div className="no-data-container">
      <div className="no-data-icon">📋</div>
      <h3>No data available</h3>
      <p>No maintenance history found for the selected criteria.</p>
    </div>
  );
};

export const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading data...</p>
    </div>
  );
}; 