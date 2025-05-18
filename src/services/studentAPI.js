import axios from 'axios';

const studentAPI = axios.create({
  baseURL: 'http://localhost:3004',
});

export default studentAPI;
