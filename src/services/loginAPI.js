import axios from 'axios';

const loginAPI = axios.create({
  baseURL: 'http://localhost:3001',
});

export default loginAPI;
