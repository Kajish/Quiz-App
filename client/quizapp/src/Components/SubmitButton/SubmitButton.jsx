import React from 'react';
import './SubmitButton.css';
const SubmitButton = ({ onClick, ...rest }) => {
  return (
    <button className="submit-button" onClick={onClick} {...rest}>
      Submit
    </button>
  );
};

export default SubmitButton;
// TODO make a folder common nand implement the common compnennts in there
// gos for submit button and previous button and the next button
