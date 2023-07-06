import React, { useEffect } from 'react';
import QuizResultService from '../../Services/QuizResultService';
import './QuizResult.css';

const QuizResult = (props) => {
  const { id, userName, userEmail, quiz, selectedOptions, score } = props;

  useEffect(() => {
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
  }, [id, userName, userEmail, quiz, selectedOptions, score]);

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
      <h1 className="quiz-header">{quiz.title} - Results</h1>
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

export default QuizResult;
