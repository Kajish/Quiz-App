import React from 'react';
import './PopUp.css';

const Popup = ({ heading, message, onConfirmationYes, onConfirmationNo }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>{heading}</h2>
        <p>{message}</p>
        <div className="popup-buttons">
          <button className="popup-button" onClick={onConfirmationYes}>
            Yes
          </button>
          <button className="popup-button" onClick={onConfirmationNo}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
