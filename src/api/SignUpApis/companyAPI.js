import { signupAPI } from '../../services/index'

export const registerCompany = (companyData) => {
  return signupAPI.post('/company', companyData, {
    withCredentials: true,
  });
};