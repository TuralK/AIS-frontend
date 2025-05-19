import React, { useState, useEffect } from 'react';
import LoginCSS from './Login.module.css';
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import IYTElogo from '../../../assets/iyte_logo_eng.png';
import { getUserType } from '../../../api/LoginApi/getUserTypeAPI';
import { forgotPassword } from '../../../api/ChangePasswordApi/forgotPasswordAPI';
import Loading from '../../../components/LoadingComponent/Loading';
import { loginAPI } from '../../../services';
import TurkeyFlag from '../../../assets/turkey.png';
import UKFlag from '../../../assets/united-kingdom.png';

const Login = () => {
  const matches = useMatches();
  const { t, i18n } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

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
  };
  
  const resetForgotPasswordForm = () => {
    setForgotEmail('');
    setForgotEmailError('');
  };

  const switchLang = () => {
    const next = i18n.language === 'tr' ? 'en' : 'tr';
    localStorage.setItem('pageLanguage', next);
    i18n.changeLanguage(next);
  };

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
        const pageLanguage = localStorage.getItem('pageLanguage');
        if (i18n.language != pageLanguage) { switchLang() }
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
      const response = await loginAPI.post('/', {
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
  };

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className={LoginCSS.background}>
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
            <button className={LoginCSS.langSwitcher} onClick={switchLang}>
                          {i18n.language === 'tr'
                            ? <img src={UKFlag} alt="English" />
                            : <img src={TurkeyFlag} alt="Türkçe" />}
                        </button>
          </div>
          <div className={LoginCSS['form-top-bottom']}>
            <hr className={LoginCSS['form-line']}></hr>
          </div>
        </div>

        <div className={LoginCSS['form-bottom']}>
          <form onSubmit={handleLoginSubmit} className={LoginCSS['signin']}>
            <p className={LoginCSS['page-name']}>{t('system_name')}</p>
            <h1 className={LoginCSS.header}>{t('login')}</h1>
            <div className={LoginCSS['form-content']}>
              <input
                type='email'
                placeholder={t('email')}
                id='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type='password'
                placeholder={t('password')}
                id='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              { 
              loginError.length > 0 && <div className={LoginCSS['login-error']}>{loginError}</div>
              }
              <div className={LoginCSS.loginLabel}>
                <label>
                  <input
                    type='checkbox'
                    id='remember'
                    name='remember'
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>{t('remember_username')}</span>
                </label>
              </div>
              <button className={LoginCSS.button} type='submit'>{t('login')}</button>
            </div>
          </form>
          <div className={`${LoginCSS['forgot-password']} ${isForgotPasswordActive ? LoginCSS.active : ''}`}>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className={LoginCSS['forgotPassword']}>
                <input
                  type='email'
                  placeholder={t('email')}
                  id='forgot-email'
                  name='forgot-email'
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                {
                  forgotEmailError.length > 0 && <div className={LoginCSS['no-user-error']}>{forgotEmailError}</div>
                }
                <button className={LoginCSS.button} type='submit'>{t('send_reset_link')}</button>
              </div>
            </form>
          </div>
          <center>
            <a className={LoginCSS.forgotPasswordButton} href='#' onClick={toggleForgotPassword}>
              {t('forgot_password')}
            </a>
          </center>
          <br />
          <center>
            <Link to='/signup'>{t('no_account_signup')}</Link>
          </center>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Login;
