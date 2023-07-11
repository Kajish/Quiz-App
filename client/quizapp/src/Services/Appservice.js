import apiUrls from '../urls/apiUrls';
import customAxios from '../CustomAxios';

export const fetchData = async (setQuizData) => {
  const urlParams = new URL(window.location.href);
  const pathParts = urlParams.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  if (
    pathParts.length === 4 &&
    pathParts[1] === 'user' &&
    pathParts[2] === 'quiz' &&
    id
  ) {
    const apiUrl = apiUrls.getQuiz(id);

    try {
      const response = await customAxios.get(apiUrl);
      setQuizData(response.data);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  }
};
