import axios from 'axios';

const customAxios = axios.create({
  baseURL: `http://localhost:${process.env.REACT_APP_SERVER_PORT}`,
});

export default customAxios;
