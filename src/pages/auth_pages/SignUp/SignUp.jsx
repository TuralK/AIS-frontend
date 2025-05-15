import React, { useState, useEffect } from 'react';
import SignUpCSS from './SignUp.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUserType } from '../../../api/LoginApi/getUserTypeAPI';
import IYTElogo from '../../../assets/iyte_logo_eng.png'
import StudentForm from '../../../components/SignUpComponents/StudentForm/StudentForm';
import CompanyForm from '../../../components/SignUpComponents/CompanyForm/CompanyForm';
import Loading from '../../../components/LoadingComponent/Loading';

const SignUp = () => {
    const matches = useMatches();
    const { t } = useTranslation();
    const currentMatch = matches[matches.length - 1];
    const titleKey = currentMatch?.handle?.titleKey;
  
    React.useEffect(() => {
      const baseTitle = 'AIS';
      document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
    }, [titleKey, t]);


    const [studentForm, setForm] = useState(true);
    const [resetKey, setResetKey] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleForm = ((formValue) => {
        setForm(formValue);
        setResetKey((prevKey) => (prevKey === 0 ? 1 : 0));
    })

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

    if (loading) {
      return (
          <Loading />
      )
    }

    return (
        <div className={SignUpCSS.background}>
            <div className={SignUpCSS.right}>
                <div className={SignUpCSS.top_right}>
                    <div className={SignUpCSS.top_right_middle}>
                        <a href="https://iyte.edu.tr/" target="_blank" rel='noopener noreferrer'>
                            <img src={IYTElogo} alt="IYTE" />
                        </a>
                    </div>
                    <div className={SignUpCSS.form_top_bottom}>
                        <hr className={SignUpCSS.form_line}></hr>
                    </div>
                </div>
                
                <div className={SignUpCSS.bottom_right}>
                    <div className={SignUpCSS.slide_controls}>
                        <input type="radio" className={SignUpCSS.slide} id="register-Student" 
                                onChange={() => handleForm(true)} checked={studentForm} />
                        <input type="radio" className={SignUpCSS.slide} id="register-Company" 
                                onChange={() => handleForm(false)} checked={!studentForm}/>
                        <label htmlFor="register-Student" className={`${SignUpCSS.slide} ${SignUpCSS.registerStudent} 
                                ${studentForm ? SignUpCSS.active : SignUpCSS.deactive}`}>Sign up Student</label>
                        <label htmlFor="register-Company" className={`${SignUpCSS.slide} ${SignUpCSS.registerCompany} 
                                ${!studentForm ? SignUpCSS.active : SignUpCSS.deactive}`}>Sign up Company</label>
                        <div className={` ${SignUpCSS.slider_tab} ${studentForm ? SignUpCSS.active : SignUpCSS.deactive}`}></div>
                    </div>

                    <div className={SignUpCSS.form_container}>
                        <div className={` ${SignUpCSS.title} ${SignUpCSS.student_form} 
                                ${studentForm ? SignUpCSS.active : SignUpCSS.deactive}`}>
                            <p name="page-name" className={SignUpCSS.page_name}>Automated Internship System</p>
                            <h1 name="header" className={SignUpCSS.header}>Sign Up Student</h1>
                            <div className={SignUpCSS.form_inner}>
                                <StudentForm reset={resetKey} />
                            </div>
                        </div>
                        <div className={SignUpCSS.title}>
                            <p name="page-name" className={SignUpCSS.page_name}>Automated Internship System</p>
                            <h1 name="header" className={SignUpCSS.header}>Sign Up Company</h1>
                            <div className={SignUpCSS.form_inner}>
                                <CompanyForm reset={resetKey} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default SignUp