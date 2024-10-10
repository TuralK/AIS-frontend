import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChangePasswordCSS from './ChangePassword.module.css';
import axios from 'axios';
import Login from '../Login/Login';
import { validateToken } from '../../../api/ChangePasswordApi/validateTokenAPI';

const ChangePassword = () => {
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
    
    useEffect( () => {
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
            alert("No token provided");
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
            setError('Passwords do not match or are less than 6 characters.');
            return;
        }

        try {
            const response = await axios.post('http://localhost/changePassword', {
                password: password,
                confirmPassword: confirmPassword,
                token: token,
            });
            if(response.status === 200){
                alert(response.data.success);
            } else {
                alert('Failed to change password. Please try again.');
            }
            navigate('/');
        } catch (err) { 
            if (err.response.data.error === "Token has expired." ||
                err.response.data.error === "Invalid or expired token.") {
                alert(err.response.data.error);
                navigate('/');
            }
            setError( err.response.data.error || 'Failed to communicate with the server');
        }
    };

    if (loading) { return null }

    return (
        <div className={ChangePasswordCSS.background}>
        <div className={ChangePasswordCSS['center-container']}>
            <div className={ChangePasswordCSS['top-of-center']}>
                <img src='https://bhib.iyte.edu.tr/wp-content/uploads/sites/115/2018/09/iyte_logo-eng.png' alt="IYTE" />
            </div>
            <center><h1>Change Your Password</h1></center>
            <form onSubmit={handleSubmit}>
                <input type="hidden" value={token} /> {/* Token field */}
                <label htmlFor="password">New Password:</label>
                <input
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
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
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
                    {error}
                </div>
                <center>
                    <button type="submit">Update Password</button>
                </center>
                {success && <center><p style={{ color: 'green' }}>{success}</p></center>}
                <center><a href='/'>Log in.</a></center>
            </form>
        </div>
        </div>
    );
};

export default ChangePassword;
