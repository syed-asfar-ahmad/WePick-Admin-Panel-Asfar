import React from 'react';
import { FaExclamationTriangle, FaRedo, FaSpinner } from 'react-icons/fa';
import './Loading.scss';

const Loading = () => {

  return (
    <div className="loading-container">
      <FaSpinner className="spinner" />
      <p>Loading...</p>
    </div>
  );
};

export default Loading;