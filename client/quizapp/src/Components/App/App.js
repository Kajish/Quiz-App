import { useEffect, useState } from "react";
import axios from "axios";
import StartPage from "../StartPage/StartPage";
import Quiz from "../Quiz/Quiz";
import Footer from "../Footer/footer";
import Header from "../header/header";
import "./App.css";

function App() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const urlParams = new URL(window.location.href);
    const pathParts = urlParams.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    if (
      pathParts.length === 4 &&
      pathParts[1] === "user" &&
      pathParts[2] === "quiz" &&
      id
    ) {
      const serverPort = process.env.REACT_APP_SERVER_PORT;
      const apiUrl = `http://localhost:${serverPort}/user/quiz/${id}`;

      axios
        .get(apiUrl)
        .then((response) => {
          setQuizData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching quiz data:", error);
        });
    }
  }, []);

  const handleStartQuiz = (name, email) => {
    setQuizStarted(true);
    setUserName(name);
    setUserEmail(email);
    console.log(name, email);
  };

  // Conditional check to render the entire block of JSX
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

  // If the condition is not met, return null or an alternative fallback component
  return null;
}

export default App;
