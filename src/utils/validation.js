export const validateSignUpForm = (password, confirmPassword) => {
  let errors = {};
  
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  
  return errors;
};  