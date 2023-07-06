import React from 'react';
import './Button.css';
const Button = ({ text, onClick, className, disabled }) => {
  return (
    <button onClick={onClick} className={className} disabled={disabled}>
      {text}
    </button>
  );
};
export default Button;
