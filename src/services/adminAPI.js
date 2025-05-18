import axios from 'axios';

const adminAPI = axios.create({
  baseURL: 'http://localhost:3003',
});

export default adminAPI;
