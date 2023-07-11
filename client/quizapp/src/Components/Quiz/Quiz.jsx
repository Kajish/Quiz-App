import React, { useState, useEffect } from 'react';
import './Quiz.css';
import PropTypes from 'prop-types';
import QuizResult from '../QuizResult/QuizResult';
import Popup from '../Common/PopUp/PopUp';
import { calculateScore } from '../../Services/QuizService';
import Button from '../Common/Button/Button';

const Quiz = (props) => {
  const { id, userName, userEmail, quiz, timeLimit, passPercentage } = props;
  const time = timeLimit * 60;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(null);
  const [showUnansweredBox, setShowUnansweredBox] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [remainingTime, setRemainingTime] = useState(time); // Initial time in seconds
  // Timer effect
  useEffect(() => {
    let interval;
    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      handleConfirmationYes(); // Call handleConfirmationYes when remainingTime is 0
    }

    return () => {
      clearInterval(interval);
    };
  }, [remainingTime]);

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionIndex]: optionIndex,
    }));
  };

  const handleNextClick = () => {
    setCurrentQuestionIndex((prevQuestionIndex) => prevQuestionIndex + 1);
  };

  const handlePreviousClick = () => {
    setCurrentQuestionIndex((prevQuestionIndex) => prevQuestionIndex - 1);
  };

  const handleSubmitClick = () => {
    let hasUnansweredQuestions = false;

    for (let i = 0; i < quiz.questions.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(selectedOptions, i)) {
        hasUnansweredQuestions = true;
        break;
      }
    }

    if (hasUnansweredQuestions) {
      setShowUnansweredBox(true);
      setShowConfirmation(false);
    } else {
      setShowConfirmation(true);
      setShowUnansweredBox(false);
    }
  };

  const handleConfirmationYes = () => {
    const totalScore = calculateScore(quiz, selectedOptions);
    setScore(totalScore);
    setShowConfirmation(false);
    setShowUnansweredBox(false);
  };

  const handleConfirmationNo = () => {
    setShowConfirmation(false);
    setShowUnansweredBox(false);
  };

  const handleJumpToQuestion = (questionIndex) => {
    setCurrentQuestionIndex(questionIndex);
  };

  const renderOptions = (questionIndex) => {
    const options = quiz.questions[questionIndex].options;
    const selectedOption = selectedOptions[questionIndex];

    return options.map((option, optionIndex) => {
      const isSelected = selectedOption === optionIndex;

      let optionClassName = 'option-container';
      if (isSelected) {
        optionClassName += ' selected';
      }

      const handleOptionDeselect = (e) => {
        e.stopPropagation();
        setSelectedOptions((prevSelectedOptions) => {
          const updatedOptions = { ...prevSelectedOptions };
          delete updatedOptions[questionIndex];
          return updatedOptions;
        });
      };

      return (
        <div
          key={optionIndex}
          className={optionClassName}
          onClick={() => handleOptionSelect(questionIndex, optionIndex)}
        >
          <span className="option-text" data-fulltext={option}>
            {option}
          </span>
          {isSelected && (
            <span className="option-deselect" onClick={handleOptionDeselect}>
              &#10005;
            </span>
          )}
        </div>
      );
    });
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div>
      {score === null ? (
        <div>
          <h1 className="quiz-header">{quiz.title}</h1>
          <div className="timer-container">
            <div className={`timer ${remainingTime > 60 ? '' : 'alert'}`}>
              Time Remaining: {Math.floor(remainingTime / 60)}:
              {remainingTime % 60}
            </div>
          </div>

          <div className="quiz-container">
            <div className="question-container">
              <p className="question-text">{currentQuestion.question}</p>
            </div>
            <div className="options-container">
              {renderOptions(currentQuestionIndex)}
            </div>
            <div className="buttons-container">
              <Button
                text="Previous"
                onClick={handlePreviousClick}
                disabled={currentQuestionIndex === 0}
                className="previous-button"
              />

              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button
                  className="next-button"
                  onClick={handleNextClick}
                  text="Next"
                />
              ) : (
                <Button
                  onClick={handleSubmitClick}
                  className="submit-button"
                  text="Submit"
                />
              )}
            </div>
            <div className="jump-container">
              <label>Jump to question:</label>
              <div className="jump-buttons">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    className={`jump-button ${
                      currentQuestionIndex === index ? 'active' : ''
                    }`}
                    onClick={() => handleJumpToQuestion(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <QuizResult
          id={id}
          userName={userName}
          userEmail={userEmail}
          quiz={quiz}
          selectedOptions={selectedOptions}
          score={score}
          passPercentage={passPercentage}
        />
      )}
      {showUnansweredBox && (
        <Popup
          heading="Submit Quiz"
          message="You have one or more unanswered questions. Are you sure you want to submit?"
          onConfirmationYes={handleConfirmationYes}
          onConfirmationNo={handleConfirmationNo}
        />
      )}
      {showConfirmation && (
        <Popup
          heading="Submit Quiz"
          message="Are you sure you want to submit the quiz?"
          onConfirmationYes={handleConfirmationYes}
          onConfirmationNo={handleConfirmationNo}
        />
      )}
    </div>
  );
};

Quiz.propTypes = {
  id: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  timeLimit: PropTypes.number.isRequired,
  quiz: PropTypes.shape({
    title: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
  }).isRequired,
  passPercentage: PropTypes.number.isRequired,
};
export default Quiz;
