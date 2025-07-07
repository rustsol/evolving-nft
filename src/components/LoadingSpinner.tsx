import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = 'Loading...' 
}) => {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }[size];

  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
      
      <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
        }

        .loading-spinner {
          position: relative;
          display: inline-block;
        }

        .spinner-small {
          width: 40px;
          height: 40px;
        }

        .spinner-medium {
          width: 60px;
          height: 60px;
        }

        .spinner-large {
          width: 80px;
          height: 80px;
        }

        .spinner-ring {
          position: absolute;
          border: 4px solid transparent;
          border-top: 4px solid;
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }

        .spinner-small .spinner-ring {
          width: 32px;
          height: 32px;
          margin: 4px;
          border-width: 3px;
        }

        .spinner-medium .spinner-ring {
          width: 52px;
          height: 52px;
          margin: 4px;
          border-width: 4px;
        }

        .spinner-large .spinner-ring {
          width: 72px;
          height: 72px;
          margin: 4px;
          border-width: 5px;
        }

        .spinner-ring:nth-child(1) {
          border-top-color: #FFD700;
          animation-delay: -0.45s;
        }

        .spinner-ring:nth-child(2) {
          border-top-color: #00FF88;
          animation-delay: -0.3s;
        }

        .spinner-ring:nth-child(3) {
          border-top-color: #00D4FF;
          animation-delay: -0.15s;
        }

        .spinner-ring:nth-child(4) {
          border-top-color: #FF69B4;
        }

        .loading-message {
          color: white;
          font-size: 1rem;
          margin: 0;
          opacity: 0.9;
          text-align: center;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};