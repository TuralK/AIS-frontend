import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, Bell } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import IYTElogo from '../../assets/iyte_logo_eng.png';
import TurkeyFlag from '../../assets/turkey.png'
import UKFlag from '../../assets/united-kingdom.png'
import Loading from '../../components/LoadingComponent/Loading.jsx';
import { logoutApi } from '../../api/LoginApi/logoutApi.js';
import { useDispatch } from 'react-redux';
import Messaging from '../../components/MessageComponents/MessagingComponent.jsx';
import { resetMessaging } from '../../slices/messageSlice.jsx';
import { resetAIChat } from '../../slices/aiChatSlice.jsx';
import styles from './UserLayout.module.css';

export const UserLayout = ({ 
  validateFunction,
  menuItems,
  userMenuItems,
  basePath,
  apiUrls,
  hasAITab = false,
  outletContext = {}
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [email, setUserMail] = useState('');
  const [userId, setUserId] = useState();
  const [applications, setApplications] = useState();
  const [sendValue, setSendValue] = useState(false)

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    localStorage.setItem('pageLanguage', lng);
    i18n.changeLanguage(lng);
  };

  const userMenuRef = useRef(null);

  useEffect(() => {
    validateFunction()
      .then((result) => {
        let userData, apps;
        if (Array.isArray(result)) {
          [userData, apps] = result;
          setSendValue(true)
        } else {
          userData = result;
          apps = null;
        }
        setUserName(userData.username);
        setApplications(apps);
        setUserMail(userData.email);
        setUserId(userData.id);
      })
      .catch(err => {
        alert(err || 'An error occured');
        navigate('/');
      })
      .finally(() => {
        const pageLanguage = localStorage.getItem('pageLanguage');
        if (pageLanguage === 'tr') {
          changeLanguage(pageLanguage);
        }
        setLoading(false);
      });
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuRef]);

  const handleDropdownItemClick = (action) => {
    // Example navigation logic – update as needed.
    setIsUserMenuOpen(false);
  };

  const isUserRouteActive = userMenuItems.some(item => {
    if (item.route === 'logout') return false;
    const userRoute = `/${basePath}/${item.route}`;
    return location.pathname === userRoute;
  });

  const logout = () => {
    dispatch(resetAIChat());
    dispatch(resetMessaging());
    localStorage.removeItem('conversationId');
    logoutApi(apiUrls.logout);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.layoutWrapper}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.flexBetween}>
            <div className={styles.flexCenter}>
              <img src={IYTElogo} alt="IZTECH Logo" className={styles.logo} />
              <div className={styles.titleContainer}>
                <div className={styles.title}>{t('title')}</div>
                <div className={styles.subtitle}>{t('subtitle')}</div>
              </div>
            </div>

            {!isMobile && (
              <div className={styles.desktopMenu}>
                {menuItems.map(({ item, route }) => (
                  <NavLink
                    key={route}
                    to={`/${basePath}/${route}`}
                    className={({ isActive }) => {
                      const active = isActive || (location.pathname === `/${basePath}` && route === 'home');
                      return active
                        ? `${styles.menuItem} ${styles.activeMenuItem}`
                        : styles.menuItem;
                    }}
                  >
                    {item}
                  </NavLink>
                ))}

                <NavLink
                  to={`/${basePath}/notifications`}
                  className={styles.menuItem}
                >
                  <Bell size={24} />
                </NavLink>

                <button
                  onClick={() => changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}
                  className={styles.menuItem}
                >
                  {i18n.language === 'tr' ? <img className={styles.flagImage} src={UKFlag}/> : <img className={styles.flagImage} src={TurkeyFlag}/>}
                </button>

                <div className={styles.menuItemDropdown} ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen);
                      setIsMessagingOpen(false);
                    }}
                    className={`${styles.menuItem} ${isUserRouteActive ? styles.activeMenuItem : ''}`}
                    style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center' }}
                  >
                    <img src={IYTElogo} alt="User profile" className={styles.profilePhoto} />
                    {userName}
                    <ChevronDown style={{ marginLeft: '0.25rem', width: '24px', height: '24px' }} />
                  </button>

                  {isUserMenuOpen && (
                    <div className={styles.dropdownMenu}>
                      {userMenuItems.map(({ item, route }) => (
                        <NavLink
                          key={route}
                          to={route !== 'logout' ? `/${basePath}/${route}` : '#'}
                        >
                          <a
                            href="#"
                            className={styles.dropdownItem}
                            onClick={(e) => {
                              if (route === 'logout') {
                                e.preventDefault();
                                logout();
                              } else {
                                handleDropdownItemClick(item.toLowerCase());
                              }
                            }}
                          >
                            {item}
                          </a>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {isMobile && (
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setIsMessagingOpen(false);
                }}
                className={styles.mobileMenuButton}
                style={{
                  display: 'flex',
                  marginRight: '-0.1rem',
                  width: '50px',
                  height: '50px'
                }}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X style={{ width: '32px', height: '32px' }} /> : <Menu style={{ width: '32px', height: '32px' }} />}
              </button>
            )}
          </div>
        </div>

        {isMobile && isMenuOpen && (
          <div className={styles.mobileMenu}>
            {menuItems.map(({ item, route }) => (
              <NavLink key={route} to={`/${basePath}/${route}`}>
                <a
                  href="#"
                  className={styles.menuItem}
                  style={{ display: 'block', padding: '0.75rem 0' }}
                >
                  <center>{item}</center>
                </a>
              </NavLink>
            ))}
            <a
              href="#"
              className={styles.menuItem}
              style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 0' }}
            >
              <Bell size={24} style={{ marginRight: '0.5rem' }} />
              {t('notifications')}
            </a>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsMessagingOpen(false);
                }}
                className={`${styles.menuItem} ${isUserRouteActive ? styles.activeMenuItem : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  background: 'transparent',
                  border: 'none'
                }}
              >
                <div className={styles.flexCenter}>
                  <img src={IYTElogo} alt="User profile" className={styles.profilePhoto} />
                  {userName}
                </div>
                <ChevronDown style={{ width: '24px', height: '24px' }} />
              </button>
              {isUserMenuOpen && (
                <div style={{ marginTop: '0.5rem' }}>
                  {userMenuItems.map(({ item, route }) => (
                    <NavLink
                      key={route}
                      to={route !== 'logout' ? `/${basePath}/${route}` : '#'}
                      className={styles.menuItem}
                      style={{ display: 'block', padding: '0.75rem 0' }}
                      onClick={(e) => {
                        if (route === 'logout') {
                          e.preventDefault();
                          logout();
                        } else {
                          handleDropdownItemClick(item.toLowerCase());
                        }
                      }}
                    >
                      {item}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <main  className={`${styles.layoutContent} ${isMenuOpen ? styles.hiddenOverflow : ""}`}>
        <div className={styles.layoutContainerContent}>
          {sendValue ? (
            <Outlet context={{ userId, email, firstName: userName, applications, setApplications }} />
          ) : (
            <Outlet />
          )}
        </div>
        
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            © {new Date().getFullYear()} IZTECH Internship Management System. All rights reserved.
          </div>
        </footer>
      </main>

      
      

      <Messaging
        hasAITab={hasAITab}
        apiUrl={apiUrls.messaging}
        isOpen={isMessagingOpen}
        onToggle={setIsMessagingOpen}
      />
    </div>
  );
};
