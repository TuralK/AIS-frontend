import axios from 'axios';

export const registerCompany = (companyData) => {
  return axios.post('http://localhost:3002/company', companyData, {
    withCredentials: true,
  });
};