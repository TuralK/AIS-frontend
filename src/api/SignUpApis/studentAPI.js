import axios from 'axios';

export const registerStudent = (studentData) => {
  return axios.post('http://localhost:3002/student', studentData, {
    withCredentials: true,
  });
};