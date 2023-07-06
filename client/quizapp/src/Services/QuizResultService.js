import customAxios from '../CustomAxios';
import apiUrls from '../urls/apiUrls';
const QuizResultService = {
  submitQuizResult: (id, userName, userEmail, quiz, selectedOptions, score) => {
    const apiUrl = apiUrls.submitQuizResult(id);

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

    return customAxios.post(apiUrl, postData);
  },
};

export default QuizResultService;
