import React from "react";
import axios from "axios";
import { useEffect } from "react";
import "./QuizResult.css";

const QuizResult = (props) => {
  const { id, userName, userEmail, quiz, selectedOptions, score } = props;
  useEffect(() => {
    const serverPort = process.env.REACT_APP_SERVER_PORT;
    const apiUrl = `http://localhost:${serverPort}/user/quiz/submit-quiz/${id}`;

    const postData = {
      name: userName,
      email: userEmail,
      score: score,
      result: quiz.questions.map((question, index) => {
        const selectedOptionIndex = selectedOptions[index];
        const selectedOption = question.options[selectedOptionIndex];
        const isCorrect = selectedOptionIndex === question.correctOption;

        return {
          question: question.question,
          options: question.options,
          userOption: selectedOption,
          isCorrect: isCorrect,
          correctOption: question.options[question.correctOption],
        };
      }),
    };

    axios
      .post(apiUrl, postData)
      .then((response) => {
        console.log("Quiz submission successful:", response.data);
      })
      .catch((error) => {
        console.error("Error submitting quiz:", error);
      });
  }, [userName, userEmail, quiz, selectedOptions, score]);

  const renderQuestionResults = () => {
    return quiz.questions.map((question, index) => {
      const selectedOptionIndex = selectedOptions[index];
      const selectedOption = question.options[selectedOptionIndex];
      const isCorrect = selectedOptionIndex === question.correctOption;

      let optionResultClassName = "option-result";
      if (selectedOptionIndex === undefined) {
        optionResultClassName += " not-selected";
      } else if (isCorrect) {
        optionResultClassName += " correct";
      } else {
        optionResultClassName += " incorrect";
      }

      return (
        <div key={index} className="question-result">
          <p className="question-text">{question.question}</p>
          <div className="options-result">
            <div className={optionResultClassName}>
              <span className="option-text">{selectedOption}</span>
              {isCorrect && <span className="answer-text">(Correct)</span>}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="results-container">
      <h1 className="quiz-header">{quiz.title} - Results</h1>
      <h3>Name:{userName}</h3>
      <h3>Email:{userEmail}</h3>
      <p className="score-text">
        Your score: {score} / {quiz.questions.length}
      </p>
      {renderQuestionResults()}
    </div>
  );
};

export default QuizResult;
