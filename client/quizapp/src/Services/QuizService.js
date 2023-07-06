const calculateScore = (quiz, selectedOptions) => {
  let totalScore = 0;
  quiz.questions.forEach((question, index) => {
    if (selectedOptions[index] === question.correctOption) {
      totalScore += 1;
    }
  });
  return totalScore;
};

export { calculateScore };
