import axios from 'axios';

const messageAPI = axios.create({
  baseURL: 'http://localhost:3007',
});

export default messageAPI;
