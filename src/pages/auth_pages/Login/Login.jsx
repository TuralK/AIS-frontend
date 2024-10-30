import React, { useState, useEffect } from 'react';
import LoginCSS from './Login.module.css';
import { Helmet } from "react-helmet";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import IYTElogo from '../../../assets/iyte_logo_eng.png'
import { getUserType } from '../../../api/LoginApi/getUserTypeAPI';
import { forgotPassword } from '../../../api/ChangePasswordApi/forgotPasswordAPI';
import Loading from '../../../components/LoadingComponent/Loading';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [isForgotPasswordActive, setIsForgotPasswordActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const resetLoginForm = () => {
    setLoginError('');
    setEmail('');
    setPassword('');
  }
  const resetForgotPasswordForm = () => {
    setForgotEmail('');
    setForgotEmailError('');
  }

  useEffect(() => {
    const fetchUserTypeAndNavigate = async () => {
      try {
        const userType = await getUserType();
        if(userType) {
          navigate("/" + userType);
        } else {
          navigate(window.location.pathname);
        }
      } catch (error) {
        console.error("Failed to fetch user type:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserTypeAndNavigate();
  }, [navigate]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);
  
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost/', {
        email,
        password,
      }, {
        withCredentials: true
      });
      resetLoginForm();
      resetForgotPasswordForm();
      if(response.status === 200){
        switch(response.data.user) {
          case "admin":
            navigate('/admin');
            break;
          case "secretary":
            navigate('/secretary');
            break;
          case "student":
            navigate('/student');
            break;
          case "company":
            navigate('/company');
            break;
        }
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }
      }
    } catch (error) {
      resetForgotPasswordForm();
      if (error.response) {
        setLoginError(error.response.data.errors.error || 'An error occurred');
      } else if (error.request) {
        setLoginError('Unable to connect to the server. Please try again later.');
      } else {
        console.log(error)
        setLoginError('An unexpected error occurred.');
      }
    }
  };

  // Function to handle forgot password form submission (example placeholder)
  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await forgotPassword(forgotEmail);
      if(response.status === 200){
        alert(response.data.success);
      } else {
        throw new Error('Failed to send code. Please try again.');
      }
      resetLoginForm();
      resetForgotPasswordForm();
    } catch (error) {
      resetLoginForm();
      setForgotEmailError(error.message || 'An unexpected error occurred');
    }
  };

  const toggleForgotPassword = () => {
    setIsForgotPasswordActive(prevState => !prevState);
    if (isForgotPasswordActive) {
      resetForgotPasswordForm();
    }
  }

  if (loading) {
    return (
        <Loading />
    )
  }

  return (
    <div className={LoginCSS.background}>
      <Helmet>
        <title>Automated Internship System Login</title>
      </Helmet>
      <div className={LoginCSS['form-container']}>
        <div className={LoginCSS['form-top']}>
          <div className={LoginCSS['form-top-middle']}>
            <a
              className={LoginCSS.logo}
              href='https://iyte.edu.tr/'
              target='_blank'
              rel='noopener noreferrer'>
              <img
                src={IYTElogo}
                alt='IYTE'
              />
            </a>
          </div>
          <div className={LoginCSS['form-top-bottom']}>
            <hr className={LoginCSS['form-line']}></hr>
          </div>
        </div>

        <div className={LoginCSS['form-bottom']}>
          <form onSubmit={handleLoginSubmit} className={LoginCSS['signin']}>
            <p className={LoginCSS['page-name']}>Automated Internship System</p>
            <h1 className={LoginCSS.header}>Login</h1>
            <div className={LoginCSS['form-content']}>
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
              loginError.length > 0 && <div className={LoginCSS['login-error']}>{loginError}</div>
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
              <button className={LoginCSS.button} type='submit'>Login</button>
            </div>
          </form>
          <div className={`${LoginCSS['forgot-password']} ${isForgotPasswordActive ? LoginCSS.active : ''}`}>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className={LoginCSS['forgotPassword']}>
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
                  forgotEmailError.length > 0 && <div className={LoginCSS['no-user-error']}>{forgotEmailError}</div>
                }
                <button className={LoginCSS.button} type='submit'>Send Reset Link</button>
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