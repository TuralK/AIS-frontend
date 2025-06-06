import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChangePasswordCSS from './ChangePassword.module.css';
import axios from 'axios';
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { validateToken } from '../../../api/ChangePasswordApi/validateTokenAPI';
import Loading from '../../../components/LoadingComponent/Loading';

const ChangePassword = () => {
    const matches = useMatches();
    const { t } = useTranslation();
    const currentMatch = matches[matches.length - 1];
    const titleKey = currentMatch?.handle?.titleKey;
    
    React.useEffect(() => {
      const baseTitle = 'IMS';
      document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
    }, [titleKey, t]);
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    // useEffect(() => {
    //     const params = new URLSearchParams(location.search);
    //     const tokenFromURL = params.get('token');

    //     if (tokenFromURL) {
    //         setToken(tokenFromURL);
    //     } else {
    //         navigate('/');
    //     }
    // }, [location, navigate]);    

    // const sleep = ms => new Promise(r => setTimeout(r, ms));

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromURL = params.get('token');

        if (tokenFromURL) {
            validateToken(tokenFromURL)
                .then(data => {
                    if (data.error) {
                        alert(data.error || "An error occured");
                        navigate('/');
                    } else {
                        setToken(tokenFromURL);
                    }
                })
                .catch(err => {
                    alert(err || "An error occured");
                    navigate('/');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            alert(t('noTokenProvided'));
            navigate('/');
        }
    }, [location, navigate]);

    const updateBorder = (field) => {
        if (field === 'password') {
            return password === '' ? '2px solid black' : password.length >= 6 ? '2px solid green' : '2px solid red';
        }
        if (field === 'confirmPassword') {
            return confirmPassword === '' ? '2px solid black' : (password === confirmPassword && confirmPassword.length >= 6) ? '2px solid green' : '2px solid red';
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword || password.length < 6) {
            setError('passwordMismatchError');
            return;
        }

        try {
            const response = await axios.post('http://localhost/changePassword', {
                password: password,
                confirmPassword: confirmPassword,
                token: token,
            });
            if (response.status === 200) {
                alert(t('passwordChangeSuccess'));
            } else {
                alert(t('passwordChangeFail'));
            }
            navigate('/');
        } catch (err) {
            if (err.response.data.error === "Token has expired." ||
                err.response.data.error === "Invalid or expired token.") {
                alert(t('invalidOrExpiredToken'));
                navigate('/');
            }
            setError(err.response.data.error || t('serverCommunicationError'));
        }
    };

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className={ChangePasswordCSS.background}>
            <div className={ChangePasswordCSS['center-container']}>
                <div className={ChangePasswordCSS['top-of-center']}>
                    <img src='https://bhib.iyte.edu.tr/wp-content/uploads/sites/115/2018/09/iyte_logo-eng.png' alt="IYTE" />
                </div>
                <center><h1>Change Your Password</h1></center>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" value={token} /> {/* Token field */}
                    <label className={ChangePasswordCSS.label} htmlFor="password">
                        {t('newPassword')}
                    </label>
                    <input
                        className={ChangePasswordCSS.input}
                        type="password"
                        id="password"
                        name="password"
                        style={{
                            fontSize: '14px',
                            border: updateBorder('password'),
                            outline: 'none', // Remove default outline
                        }}
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <label className={ChangePasswordCSS.label} htmlFor="confirmPassword">
                        {t('confirmPassword')}
                    </label>
                    <input
                        className={ChangePasswordCSS.input}
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        style={{
                            fontSize: '14px',
                            border: updateBorder('confirmPassword'),
                            outline: 'none', // Remove default outline
                        }}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                    />
                    <div className={ChangePasswordCSS['change-password-error']} style={{ color: 'red', display: error ? 'block' : 'none' }}>
                        {t(error)}
                    </div>
                    <center>
                        <button className={ChangePasswordCSS.button} type="submit">{t('updatePasswordButton')}</button>
                    </center>
                    {success && <center><p style={{ color: 'green' }}>{success}</p></center>}
                    <center><a href='/'>{t('loginLink')}</a></center>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
