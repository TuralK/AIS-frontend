import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, Bell } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import IYTElogo from "../../assets/iyte_logo_eng.png";
import { validateDIC } from '../../api/DICApi/validateDICApi.js';
import Loading from '../../components/LoadingComponent/Loading.jsx';
import Messaging from '../../components/MessageComponents/MessagingComponent.jsx';
import { useDispatch } from "react-redux";
import { resetMessaging } from '../../slices/messageSlice.jsx';
import { logoutApi } from '../../api/LoginApi/logoutApi.js';

const styles = {
  nav: {
    backgroundColor: '#9a1220',
    color: 'white',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100px',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '70px',
    width: 'auto',
  },
  titleContainer: {
    marginLeft: '1rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.25rem',
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
  },
  mobileMenuButton: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    color: 'white',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
  },
  mobileMenu: {
    padding: '0.5rem 1rem 1rem',
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    marginTop: '0.5rem',
    width: '12rem',
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  },
  dropdownItem: {
    display: 'block',
    padding: '0.75rem 1rem',
    fontSize: '1.125rem',
    color: '#333',
    transition: 'background-color 0.3s ease',
  },
  profilePhoto: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '0.5rem',
  },
  menuItem: {
    padding: '0.75rem 1rem',
    fontSize: '1.125rem', // Normal durumdaki yazı boyutu
    fontWeight: '400',    // Normal durumdaki yazı kalınlığı
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    textDecoration: 'none',
    color: '#ffffffcc',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '-2px', // Çizgiyi tam altında konumlandır
    left: 0,
    width: '100%',
    height: '3px', // Çizgi kalınlığı
    backgroundColor: '#00ffff', // Çizgi rengi - istediğiniz renge değiştirebilirsiniz
    transform: 'scaleX(0)',
    transition: 'transform 0.3s ease',
    transformOrigin: 'left'
  }
};

export const DICLayoutOLD = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://localhost:3003');
  const [apiUrlLogout, setApiUrlLogout] = useState('http://localhost:3001');
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Change language function
  const changeLanguage = (lng) => {
    localStorage.setItem('pageLanguage', lng);
    i18n.changeLanguage(lng);
  };

  const userMenuRef = useRef(null);

  useEffect(() => {
    validateDIC()
      .then(userData => {
        setUserName(userData.username);
      })
      .catch(err => {
        alert(err || "An error occurred");
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
      setIsMobile(window.innerWidth < 768);
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

  const menuItems = [
    { item: t('home'), route: 'home' },
    { item: t('company'), route: 'companyRequests' },
    { item: t('announcements'), route: 'announcementRequests' },
    { item: t('applications'), route: 'applicationRequests' },
    { item: t('internship'), route: 'internships' },
  ];

  const userMenuItems = [
    { item: t('settings'), route: 'settings' },
    { item: t('logout'), route: 'logout' }
  ];

  const handleDropdownItemClick = (action) => {
    <NavLink
      key={route}
      to={`/admin/${route}`}></NavLink>
    setIsUserMenuOpen(false);
  };

  const logout = () => {
    dispatch(resetMessaging());
    localStorage.removeItem("conversationId");
    logoutApi(apiUrlLogout);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <nav style={styles.nav}>
        <div style={styles.container}>
          <div style={styles.flexBetween}>
            <div style={styles.flexCenter}>
              <img src={IYTElogo} alt="IZTECH Logo" style={styles.logo} />
              <div style={styles.titleContainer}>
                <div style={styles.title}>{t('title')}</div>
                <div style={styles.subtitle}>{t('subtitle')}</div>
              </div>
            </div>

            {!isMobile && (
              <div style={styles.desktopMenu}>
                {menuItems.map(({ item, route }) => (
                  <NavLink
                    key={route}
                    to={`/admin/${route}`}
                    style={({ isActive }) => ({
                      ...styles.menuItem,
                      fontSize: isActive || location.pathname === '/admin' && route === 'home' ? '1.25rem' : '1.125rem',
                      fontWeight: isActive || location.pathname === '/admin' && route === 'home' ? '600' : '400',
                      color: isActive || location.pathname === '/admin' && route === 'home' ? '#ffffff' : '#ffffffcc',
                      borderBottom: (isActive || location.pathname === '/admin' && route === 'home') ? '4px solid #ffffff' : 'none',
                      position: 'relative'
                    })}
                  >
                    {item}
                  </NavLink>
                ))}
                <NavLink to="/admin/notifications"
                  href="#"
                  style={{
                    ...styles.menuItem,
                    ':hover': { backgroundColor: '#7d0e1a' },
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#7d0e1a')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                >
                  <Bell size={24} />
                </NavLink>

                <div>
                  <button
                    onClick={() => changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}
                    style={{
                      ...styles.menuItem,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'white',
                      padding: '0.5rem 1rem',
                    }}
                  >
                    {i18n.language === 'tr' ? 'En' : 'Tr'}
                  </button>
                </div>

                <div style={{ position: 'relative' }} ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen)
                      setIsMessagingOpen(false)
                    }}
                    style={{
                      ...styles.menuItem,
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'white',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#7d0e1a')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    <img src={IYTElogo} alt="User profile" style={styles.profilePhoto} />
                    {userName}
                    <ChevronDown style={{ marginLeft: '0.25rem', width: '24px', height: '24px' }} />
                  </button>

                  {isUserMenuOpen && (
                    <div style={styles.dropdownMenu}>
                      {userMenuItems.map(({ item, route }) => (
                        <NavLink
                          key={route}
                          to={route !== 'logout' ? `/admin/${route}` : '#'}
                        >
                          <a
                            key={item}
                            href="#"
                            style={{
                              ...styles.dropdownItem,
                              ':hover': { backgroundColor: '#f3f4f6' },
                            }}
                            onClick={(e) => {
                              if (route === 'logout') {
                                e.preventDefault();
                                logout();
                              } else {
                                handleDropdownItemClick(item.toLowerCase());
                              }
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
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
                  setIsUserMenuOpen(!isUserMenuOpen)
                  setIsMessagingOpen(false)
                }}
                style={{
                  ...styles.mobileMenuButton,
                  display: 'flex',
                  marginRight: '-0.1rem',
                  width: '50px',
                  height: '50px'
                }}
              >
                <span style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}>
                  Open main menu
                </span>
                {isMenuOpen ? <X style={{ width: '32px', height: '32px' }} /> : <Menu style={{ width: '32px', height: '32px' }} />}
              </button>
            )}
          </div>
        </div>
        {isMobile && isMenuOpen && (
          <div style={styles.mobileMenu}>
            {menuItems.map(({ item, route }) => (
              <NavLink
                key={route}
                to={`/admin/${route}`}>
                <a
                  key={item}
                  href="#"
                  style={{
                    ...styles.menuItem,
                    display: 'block',
                    padding: '0.75rem 0',
                    ':hover': { backgroundColor: '#7d0e1a' },
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#7d0e1a')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                >
                  <center>{item}</center>
                </a>
              </NavLink>
            ))}
            <a
              href="#"
              style={{
                ...styles.menuItem,
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 0',
                ':hover': { backgroundColor: '#7d0e1a' },
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#7d0e1a')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              <Bell size={24} style={{ marginRight: '0.5rem' }} />
              {t('notifications')}
            </a>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen)
                  setIsMessagingOpen(false)
                }}
                style={{
                  ...styles.menuItem,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem 0',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#7d0e1a')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={IYTElogo} alt="" style={styles.profilePhoto} />
                  {userName}
                </div>
                <ChevronDown style={{ width: '24px', height: '24px' }} />
              </button>
              {isUserMenuOpen && (
                <div style={{ marginTop: '0.5rem' }}>
                  {userMenuItems.map(({ item, route }) => (
                    <NavLink
                      key={route}
                      to={route !== 'logout' ? `/admin/${route}` : '#'}
                      style={{
                        ...styles.menuItem,
                        display: 'block',
                        padding: '0.75rem 0',
                        ':hover': { backgroundColor: '#7d0e1a' },
                      }}
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
      <main>
        <Outlet />
      </main>
      <Messaging
        hasAITab={false}
        apiUrl={apiUrl}
        isOpen={isMessagingOpen}
        onToggle={setIsMessagingOpen}
      />
    </div>
  );
};