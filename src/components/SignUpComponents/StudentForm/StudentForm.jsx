import React, { useState, useEffect,  } from 'react'
import StudentFormCSS from './StudentForm.module.css'
import { registerStudent } from '../../../api/SignUpApis/studentAPI';
import { validateSignUpForm } from '../../../utils/validation';
import axios from 'axios';

const StudentForm = ({ reset }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({
        email: '',
        password: '',
        confirmPassword: ''
    });
  }, [reset]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setErrors({
      email: '',
      password: '',
      confirmPassword: ''
    });

    const validationErrors = validateSignUpForm(password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await registerStudent({ email, password, confirmPassword });
      if(response.status === 200) {
        // navigate to Student's homepage
      }
    } catch (error) {
      if (error.status === 400) {
        const responseErrors = error.response.data.errors;
        if (responseErrors.email != '') {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: responseErrors.email
          }));
        } else if (responseErrors.password != '') {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: responseErrors.password
          }));
        } else if (responseErrors.confirmPassword != '') {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: responseErrors.confirmPassword
          }));
        }
      } else if (error.code == 'ERR_NETWORK') {
        if (error.message == 'Network Error') {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: "Unable to connect to the server. Please try again later."
          }));
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={StudentFormCSS.registerStudent} id="registerStudent">
      <div className={StudentFormCSS.bottomRightInner}>
        <div className={StudentFormCSS.container}>
          <input
            type="email"
            value={email}
            style={{ fontSize: '14px' }}
            placeholder="Email"
            id="student-email"
            name="student-email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className={`${StudentFormCSS.email} ${StudentFormCSS.error}`}>{errors.email}</div>

          <input
            type="password"
            value={password}
            style={{ fontSize: '14px' }}
            placeholder="Password"
            id="student-password"
            name="student-password"
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <div className={`${StudentFormCSS.password} ${StudentFormCSS.error}`}>{errors.password}</div>

          <input
            type="password"
            value={confirmPassword}
            style={{ fontSize: '14px' }}
            placeholder="Confirm password"
            id="student-confirmPassword"
            name="student-confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className={`${StudentFormCSS.confirm} ${StudentFormCSS.error}`}>{errors.confirmPassword}</div>

          <button className={StudentFormCSS.button} type="submit" value="Sign Up">
            Sign up
          </button>

          <center>
            <li>
              <a href="/">You already have an account? Log in.</a>
            </li>
          </center>
        </div>
      </div>
    </form>
  );
};

export default StudentForm