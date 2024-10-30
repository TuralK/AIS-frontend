import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import IYTElogo from '../../../assets/iyte_logo_eng.png';
import { getUserType } from '../../../api/LoginApi/getUserTypeAPI';
import { forgotPassword } from '../../../api/ChangePasswordApi/forgotPasswordAPI';
import Loading from '../../../components/LoadingComponent/Loading';

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotEmailError, setForgotEmailError] = useState('')
  const [isForgotPasswordActive, setIsForgotPasswordActive] = useState(false)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const resetLoginForm = () => {
    setLoginError('')
    setEmail('')
    setPassword('')
  }

  const resetForgotPasswordForm = () => {
    setForgotEmail('')
    setForgotEmailError('')
  }

  useEffect(() => {
    const fetchUserTypeAndNavigate = async () => {
      try {
        const userType = await getUserType()
        if(userType) {
          navigate("/" + userType)
        } else {
          navigate(window.location.pathname)
        }
      } catch (error) {
        console.error("Failed to fetch user type:", error)
      } finally {
        setLoading(false)
      }
    }
  
    fetchUserTypeAndNavigate()
  }, [navigate])

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
    }
  }, [])
  
  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post('http://localhost/', {
        email,
        password,
      }, {
        withCredentials: true
      })
      resetLoginForm()
      resetForgotPasswordForm()
      if(response.status === 200){
        switch(response.data.user) {
          case "admin":
            navigate('/admin')
            break
          case "secretary":
            navigate('/secretary')
            break
          case "student":
            navigate('/student')
            break
          case "company":
            navigate('/company')
            break
        }
        if (rememberMe) {
          localStorage.setItem('savedEmail', email)
        } else {
          localStorage.removeItem('savedEmail')
        }
      }
    } catch (error) {
      resetForgotPasswordForm()
      if (error.response) {
        setLoginError(error.response.data.errors.error || 'An error occurred')
      } else if (error.request) {
        setLoginError('Unable to connect to the server. Please try again later.')
      } else {
        console.log(error)
        setLoginError('An unexpected error occurred.')
      }
    }
  }

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await forgotPassword(forgotEmail)
      if(response.status === 200){
        alert(response.data.success)
      } else {
        throw new Error('Failed to send code. Please try again.')
      }
      resetLoginForm()
      resetForgotPasswordForm()
    } catch (error) {
      resetLoginForm()
      setForgotEmailError(error.message || 'An unexpected error occurred')
    }
  }

  const toggleForgotPassword = (e) => {
    e.preventDefault()
    setIsForgotPasswordActive(prevState => !prevState)
    if (isForgotPasswordActive) {
      resetForgotPasswordForm()
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="relative min-h-screen w-full bg-cover bg-center" 
         style={{
           backgroundImage: "url('https://ceng.iyte.edu.tr/wp-content/uploads/sites/124/2017/02/100_3495.jpg')"
         }}>
      <Helmet>
        <title>Automated Internship System Login</title>
      </Helmet>
      
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Compact login container - reduced padding and spacing */}
      <div className="absolute right-0 top-0 mx-auto w-full max-w-md bg-white p-6 shadow-xl md:right-8 md:top-8 md:rounded-lg"
        style={{ maxHeight: '92vh', overflowY: 'hidden', maxWidth: '400px' }}>
        <div className="flex flex-col gap-4" style={{overflowY: 'auto'}}>
          {/* Logo section - reduced size */}
          <div className="flex justify-center">
            <a
              href="https://iyte.edu.tr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <img
                src={IYTElogo}
                alt="IYTE"
                width={130} // Yeni genişlik
                height={130} // Yeni yükseklik
                className="h-100 w-100"
              />
            </a>
          </div>

          <div className="text-center">
            <hr className="mx-auto w-[85%] border-black/15" />
          </div>

          <div className="text-sm text-gray-600">
            Automated Internship System
          </div>

          <h1 className="text-2xl font-normal">Login</h1>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-900 focus:outline-none focus:ring-1 focus:ring-red-900"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-900 focus:outline-none focus:ring-1 focus:ring-red-900"
              required
            />

            {loginError && (
              <div className="text-sm text-red-600">{loginError}</div>
            )}

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-red-900 focus:ring-red-900"
              />
              <span className="text-sm text-gray-600">Remember your username</span>
            </label>

            <button
              type="submit"
              className="w-full rounded-md bg-red-900 py-2 text-white transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-900 focus:ring-offset-2"
            >
              Login
            </button>
          </form>

          <div className={`overflow-hidden transition-all duration-300 ${
            isForgotPasswordActive ? 'max-h-40' : 'max-h-0'
          }`}>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-900 focus:outline-none focus:ring-1 focus:ring-red-900"
                required
              />
              {forgotEmailError && (
                <div className="text-sm text-red-600">{forgotEmailError}</div>
              )}
              <button
                type="submit"
                className="w-full rounded-md bg-red-900 py-2 text-white transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-900 focus:ring-offset-2"
              >
                Send Reset Link
              </button>
            </form>
          </div>

          <div className="space-y-2 text-center">
            <button
              onClick={toggleForgotPassword}
              className="text-sm text-red-900 hover:underline"
            >
              Forgot Password?
            </button>
            <div className="text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-red-900 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}