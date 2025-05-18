import { signupAPI } from '../../services/index'

export const registerStudent = (studentData) => {
  return signupAPI.post('/student', studentData, {
    withCredentials: true,
  });
};