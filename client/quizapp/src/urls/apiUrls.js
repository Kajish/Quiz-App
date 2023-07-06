const apiUrls = {
  getQuiz: (id) => `/user/quiz/${id}`,
  submitQuizResult: (id) => `/user/quiz/submit-quiz/${id}`,
};

export default apiUrls;
