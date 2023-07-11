import React, { useEffect } from 'react';
import QuizResultService from '../../Services/QuizResultService';
import PropTypes from 'prop-types';
import './QuizResult.css';

const QuizResult = (props) => {
  const {
    id,
    userName,
    userEmail,
    quiz,
    selectedOptions,
    score,
    passPercentage,
  } = props;
  console.log(passPercentage);
  useEffect(() => {
    console.log('effect triggerd');
    const submitQuiz = async () => {
      try {
        const response = await QuizResultService.submitQuizResult(
          id,
          userName,
          userEmail,
          quiz,
          selectedOptions,
          score
        );
        console.log('Quiz submission successful:', response.data);
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }
    };

    submitQuiz();
  }, []);
  // , [id, userName, userEmail, quiz, selectedOptions, score]

  const renderQuestionResults = () => {
    return quiz.questions.map((question, index) => {
      const selectedOptionIndex = selectedOptions[index];
      const selectedOption = question.options[selectedOptionIndex];
      const isCorrect = selectedOptionIndex === question.correctOption;

      let optionResultClassName = 'option-result';
      if (selectedOptionIndex === undefined) {
        optionResultClassName += ' not-selected';
      } else if (isCorrect) {
        optionResultClassName += ' correct';
      } else {
        optionResultClassName += ' incorrect';
      }

      const questionNumber = index + 1;

      return (
        <div key={index} className="question-result">
          <div>
            {' '}
            <p className="question-text question-number">
              {questionNumber}. {question.question}
            </p>
          </div>

          <div className="options-result">
            <div className={optionResultClassName}>
              <span className="option-text">{selectedOption}</span>
              {!isCorrect && (
                <span className="correct-option">
                  (Correct Option: {question.options[question.correctOption]})
                </span>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="results-container">
      {/* <h1 className="quiz-header">{quiz.title} - Results</h1> */}
      <div className="user-info">
        <div className="user-name">
          <span className="info-label">Name: {userName}</span>
        </div>
        <div className="user-email">
          <span className="info-label">Email: {userEmail}</span>
        </div>
      </div>
      <p className="score-text">
        Your score:{' '}
        <span className="score">
          {score} / {quiz.questions.length}
        </span>
      </p>
      <hr className="separator" />

      {renderQuestionResults()}
    </div>
  );
};

QuizResult.propTypes = {
  id: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  quiz: PropTypes.object.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  score: PropTypes.number.isRequired,
  passPercentage: PropTypes.number.isRequired,
};

export default QuizResult;
