import React, { useEffect } from 'react';

function LoadingSpinner() {
  useEffect(() => {
    const styles = `
      .loading-spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80vh;
        background-color: #f5f7fa;
      }

      .loading-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border-left-color: #3498db;
        animation: spin 1s ease infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default LoadingSpinner;
