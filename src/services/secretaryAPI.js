import axios from 'axios';

const secretaryAPI = axios.create({
  baseURL: 'http://localhost:3006',
});

export default secretaryAPI;
