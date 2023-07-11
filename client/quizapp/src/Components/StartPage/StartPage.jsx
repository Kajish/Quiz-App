import React, { useState } from 'react';
import './StartPage.css';
import PropTypes from 'prop-types';

const StartPage = (props) => {
  const { quizDescription } = props;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const [emailError, setEmailError] = useState('');

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    checkFormValidity(newName, email);
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    checkFormValidity(name, newEmail);
  };

  const checkFormValidity = (newName, newEmail) => {
    const isNameValid = newName.trim() !== '';
    const isEmailValid = newEmail.trim() !== '' && validateEmail(newEmail);
    const isValid = isNameValid && isEmailValid;
    setIsFormValid(isValid);

    if (newEmail.trim() !== '' && !isEmailValid) {
      setEmailError('Enter a valid email');
    } else {
      setEmailError('');
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleStartClick = () => {
    if (isFormValid) {
      // Perform start action or navigate to a new page
      props.onStartQuiz(name, email);
    }
  };
  //TODO  take description of the quiz from props and give it in the h1 tag
  return (
    <div>
      <h1>{quizDescription}</h1>
      <div className="component1">
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className={emailError ? 'error' : ''}
          />

          {emailError && <p className="error-message">{emailError}</p>}
        </div>

        <button
          className={isFormValid ? 'start-button valid' : 'start-button'}
          onClick={handleStartClick}
          disabled={!isFormValid}
        >
          Start
        </button>
      </div>
    </div>
  );
};
StartPage.propTypes = {
  quizDescription: PropTypes.string.isRequired,
  onStartQuiz: PropTypes.func.isRequired,
};

export default StartPage;
