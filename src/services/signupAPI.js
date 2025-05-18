import axios from 'axios';

const signupAPI = axios.create({
  baseURL: 'http://localhost:3002',
});

export default signupAPI;
