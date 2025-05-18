import axios from 'axios';

const companyAPI = axios.create({
  baseURL: 'http://localhost:3005',
});

export default companyAPI;
