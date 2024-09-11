import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [isForgotPasswordActive, setIsForgotPasswordActive] = useState(false);

  useEffect(() => {
    // Retrieve email from localStorage on component mount
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);
  
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/', {
        email,
        password,
      }, {
        withCredentials: true
      });
      setLoginError('');
      setEmail('');
      setPassword('');
      if(response.status === 200){
        switch(response.data.user) {
          case "admin":
            //navigate('/admin');
            console.log("Navigate to admin.")
            break;
          case "secretary":
            //navigate('/secretary');
            console.log("Navigate to secretary.")
            break;
          case "student":
            //navigate('/student');
            console.log("Navigate to student.")
            break;
          case "company":
            //navigate('/company');
            console.log("Navigate to company.")
            break;
        }
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }
      }
    } catch (error) {
      if (error.response) {
        setLoginError(error.response.data.errors.error || 'An error occurred');
      } else if (error.request) {
        setLoginError('Unable to connect to the server. Please try again later.');
      } else {
        setLoginError('An unexpected error occurred.');
      }
    }
  };

  // Function to handle forgot password form submission (example placeholder)
  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/forgotPassword', {
        email: forgotEmail,
      }, {
        withCredentials: true,
      });
      if(response.status === 200){
        alert(response.data.success);
      } else {
        alert('Failed to send code. Please try again.');
      }
      setForgotEmail('');
      setForgotEmailError('');
    } catch (error) {
      setForgotEmailError(error.response.data.error || 'An unexpected error occurred');
    }
  };

  const toggleForgotPassword = () => {
    setIsForgotPasswordActive(prevState => !prevState);
    if (isForgotPasswordActive) {
      setForgotEmail('');
      setForgotEmailError('');
    }
  }
  
  // don't forget to set logo to the page, add pictures to assets folder instead of using web url

  return (
    <div className='background'>
      <div className='form-container'>
        <div className='form-top'>
          <div className='form-top-middle'>
            <a
              className='logo'
              href='https://iyte.edu.tr/'
              target='_blank'
              rel='noopener noreferrer'>
              <img
                className='form-image'
                src='https://bhib.iyte.edu.tr/wp-content/uploads/sites/115/2018/09/iyte_logo-eng.png'
                alt='IYTE'
              />
            </a>
          </div>
          <div className='form-top-bottom'>
            <hr className='form-line'></hr>
          </div>
        </div>

        <div className='form-bottom'>
          <form onSubmit={handleLoginSubmit} className='signin'>
            <p name='page-name'>Automated Internship System</p>
            <h1 name='header'>Login</h1>
            <div className='form-content'>
              <input
                type='email'
                placeholder='Email'
                id='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type='password'
                placeholder='Password'
                id='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              { 
              loginError.length > 0 && <div className='login error'>{loginError}</div>
              }
              <label>
              <input
                  type='checkbox'
                  id='remember'
                  name='remember'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span> Remember your username</span>
              </label>
              <button type='submit'>Login</button>
            </div>
          </form>
          <div className={`forgot-password ${isForgotPasswordActive ? 'active' : ''}`}>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className='forgotPassword'>
                <input
                  type='email'
                  placeholder='Email'
                  id='forgot-email'
                  name='forgot-email'
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                {
                  forgotEmailError.length > 0 && <div className='no user error'>{forgotEmailError}</div>
                }
                <button type='submit'>Send Reset Link</button>
              </div>
            </form>
          </div>
          <center>
            <a href='#' onClick={toggleForgotPassword}>
              Forgot Password?
            </a>
          </center>
          <br />
          <center>
            <Link to='/signup'>Don't have an account? Sign up.</Link>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Login;