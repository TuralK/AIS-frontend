import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CompanyFormCSS from './CompanyForm.module.css'
import { validateSignUpForm } from '../../../utils/validation';
import { registerCompany } from '../../../api/SignUpApis/companyAPI';
import { useTranslation } from 'react-i18next';

const CompanyForm = (reset) => {
  const { t, i18n } = useTranslation();
  
  const[companyName, setCompanyName] = useState('');
  const[representativeName, setRepresentativeName] = useState('');
  const[companyEmail, setCompanyEmail] = useState('');
  const[companyAddress, setCompanyAddress] = useState('');
  const[companyPassword, setCompanyPassword] = useState('');
  const[companyConfirmPassword, setCompanyConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setCompanyName('');
    setRepresentativeName('');
    setCompanyEmail('');
    setCompanyAddress('');
    setCompanyPassword('');
    setCompanyConfirmPassword('');
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

    const validationErrors = validateSignUpForm(companyPassword, companyConfirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await registerCompany({
        name: companyName,
        username: representativeName,
        email: companyEmail,
        password: companyPassword,
        address: companyAddress,
        confirmPassword: companyConfirmPassword
      });
      if(response.status === 200) {
        // alert(response.data.message);
        window.location.reload();
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
    <form onSubmit={handleSubmit} className={CompanyFormCSS.registerCompany} id="registerCompany">
      <div className={CompanyFormCSS.bottomRightInner}>
        <div className={CompanyFormCSS.container}>
          <input
            type="text"
            value={companyName}
            placeholder={t('companyName')}
            id="company-name"
            name="company-name"
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className={CompanyFormCSS.input}
          />
          <input
            type="text"
            value={representativeName}
            placeholder={t('representativeName')}
            id="representative-name"
            name="representative-name"
            onChange={(e) => setRepresentativeName(e.target.value)}
            required
            className={CompanyFormCSS.input}
          />
          <input
            type="email"
            value={companyEmail}
            placeholder={t('companyEmail')}
            id="company-email"
            name="company-email"
            onChange={(e) => setCompanyEmail(e.target.value)}
            required
            className={CompanyFormCSS.input}
          />
          <div className={`${CompanyFormCSS.email} ${CompanyFormCSS.error}`}>{errors.email}</div>
          
          <input
            type="text"
            value={companyAddress}
            placeholder={t('address')}
            id="company-address"
            name="company-address"
            onChange={(e) => setCompanyAddress(e.target.value)}
            required
            className={CompanyFormCSS.input}
          />
          <input
            type="password"
            value={companyPassword}
            placeholder={t('password')}
            id="company-password"
            name="company-password"
            onChange={(e) => setCompanyPassword(e.target.value)}
            minLength={6}
            required
            className={CompanyFormCSS.input}
          />
          <div className={`${CompanyFormCSS.password} ${CompanyFormCSS.error}`}>{errors.password}</div>

          <input
            type="password"
            value={companyConfirmPassword}
            placeholder={t('confirmPassword')}
            id="company-confirmPassword"
            name="company-confirmPassword"
            onChange={(e) => setCompanyConfirmPassword(e.target.value)}
            required
            className={CompanyFormCSS.input}
          />
          <div className={`${CompanyFormCSS.confirm} ${CompanyFormCSS.error}`}>{errors.confirmPassword}</div>
          </div>
          <button type="submit" className={CompanyFormCSS.button}>{t('signUp')}</button>
          <center>
            <li>
              <a href="/" className={CompanyFormCSS.link}>{t('alreadyHaveAccount')}</a>
            </li>
          </center>
        </div>
    </form>
  );
};

export default CompanyForm