import React, { useEffect, useState } from 'react';

import StartPage from '../StartPage/StartPage';
import Quiz from '../Quiz/Quiz';
import Footer from '../Footer/footer';
import Header from '../header/header';
import './App.css';
import { fetchData } from '../../Services/Appservice';

function App() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    console.log('1');
    fetchData(setQuizData);
  }, [setQuizData]);

  const handleStartQuiz = (name, email) => {
    setQuizStarted(true);
    setUserName(name);
    setUserEmail(email);
  };
  console.log(quizData);
  if (quizData && quizData.questions.length > 0) {
    return (
      <div>
        <Header />
        <div className="App">
          {quizStarted ? (
            <Quiz
              id={quizData.link}
              userName={userName}
              userEmail={userEmail}
              quiz={quizData}
              timeLimit={quizData.timeLimit}
              passPercentage={quizData.passPercentage}
            />
          ) : (
            <StartPage
              quizDescription={quizData.title}
              onStartQuiz={handleStartQuiz}
            />
          )}
        </div>

        <Footer />
      </div>
    );
  }

  return null;
}

export default App;
