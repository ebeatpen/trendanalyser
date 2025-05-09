import React from 'react';

/**
 * Header component with title and print button
 */
function Header() {
  /**
   * Handles print button click
   */
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="header">
      <div className="title"><h3>AC Trend Analysis Tool</h3></div>
      <div className="controls">
        <button className="print-button" onClick={handlePrint}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path
              d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
            ></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print
        </button>
      </div>
    </div>
  );
}

export default Header;