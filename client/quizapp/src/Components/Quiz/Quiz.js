import React, { useState } from "react";
import "./Quiz.css";
import QuizResult from "../QuizResult/QuizResult";

const Quiz = (props) => {
  const { id, userName, userEmail, quiz } = props;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    setShowConfirmation(true);
  };

  const handleConfirmationYes = () => {
    let totalScore = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correctOption) {
        totalScore += 1;
      }
    });
    setScore(totalScore);
    setShowConfirmation(false);
  };

  const handleConfirmationNo = () => {
    setShowConfirmation(false);
  };

  const handleJumpToQuestion = (questionIndex) => {
    setCurrentQuestionIndex(questionIndex);
  };

  const renderOptions = (questionIndex) => {
    const options = quiz.questions[questionIndex].options;
    const correctOption = quiz.questions[questionIndex].correctOption;
    const selectedOption = selectedOptions[questionIndex];

    return options.map((option, optionIndex) => {
      const isSelected = selectedOption === optionIndex;
      const isCorrect = correctOption === optionIndex;

      let optionClassName = "option-container";
      if (isSelected) {
        optionClassName += " selected";
      }
      if (isSelected && isCorrect) {
        optionClassName += " correct";
      }
      if (isSelected && !isCorrect) {
        optionClassName += " incorrect";
      }

      return (
        <div
          key={optionIndex}
          className={optionClassName}
          onClick={() => handleOptionSelect(questionIndex, optionIndex)}
        >
          <span className="option-text" data-fulltext={option}>
            {option}
          </span>
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
          <div className="quiz-container">
            <div className="question-container">
              <p className="question-text">{currentQuestion.question}</p>
            </div>
            <div className="options-container">
              {renderOptions(currentQuestionIndex)}
            </div>
            <div className="buttons-container">
              <button
                className="previous-button"
                onClick={handlePreviousClick}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <button className="next-button" onClick={handleNextClick}>
                  Next
                </button>
              ) : (
                <button className="submit-button" onClick={handleSubmitClick}>
                  Submit
                </button>
              )}
            </div>
            <div className="jump-container">
              <label>Jump to question:</label>
              <div className="jump-buttons">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    className={`jump-button ${
                      currentQuestionIndex === index ? "active" : ""
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
        />
      )}

      {showConfirmation && (
        <div className="popup">
          <div className="popup-content">
            <h2>Submit Quiz</h2>
            <p>Are you sure you want to submit the quiz?</p>
            <div className="popup-buttons">
              <button className="popup-button" onClick={handleConfirmationYes}>
                Yes
              </button>
              <button className="popup-button" onClick={handleConfirmationNo}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
