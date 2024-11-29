import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, Bell } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import IYTElogo from "../../assets/iyte_logo_eng.png";
import { validateSecretary } from '../../api/SecretaryApi/validateSecretaryApi.js';
import Loading from '../../components/LoadingComponent/Loading.jsx';

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

export const SecretaryLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [applications,setApplications] = useState();
  const { t, i18n } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();

  // Change language function
  const changeLanguage = (lng) => {
    localStorage.setItem('pageLanguage', lng);
    i18n.changeLanguage(lng);
  };

  const userMenuRef = useRef(null);

  useEffect(() => {
    validateSecretary()
      .then(([dataValues, applications]) => {
        setUserName(dataValues.username);
        setApplications(applications);
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
  ];

  const userMenuItems = [
    { item: t('settings'), route: 'settings' },
    { item: t('logout'), route: 'logout' }
  ];

  const handleDropdownItemClick = (action) => {
    console.log(`Performing action: ${action}`);
    setIsUserMenuOpen(false);
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  };

  const logout = () => {
    deleteCookie('jwt');
    navigate('/');
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
                    to={`/secretary/${route}`}
                    style={({ isActive }) => ({
                      ...styles.menuItem,
                      fontSize: isActive || location.pathname === '/secretary' && route === 'pendingInternships' ? '1.25rem' : '1.125rem',
                      fontWeight: isActive || location.pathname === '/secretary' && route === 'pendingInternships' ? '600' : '400',
                      color: isActive || location.pathname === '/secretary' && route === 'pendingInternships' ? '#ffffff' : '#ffffffcc',
                      borderBottom: (isActive || location.pathname === '/secretary' && route === 'pendingInternships') ? '4px solid #ffffff' : 'none',
                      position: 'relative'
                    })}
                  >
                    {item}
                  </NavLink>
                ))}
                <NavLink to="/secretary/notifications"
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
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
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
                          to={route !== 'logout' ? `/secretary/${route}` : '#'}
                          style={styles.dropdownItem}
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

            {isMobile && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={styles.mobileMenuButton}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>

        {isMobile && isMenuOpen && (
          <div style={styles.mobileMenu}>
            {menuItems.map(({ item, route }) => (
              <NavLink
                key={route}
                to={`/secretary/${route}`}
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  backgroundColor: isActive ? '#7d0e1a' : 'transparent',
                  color: isActive ? '#ffffff' : '#ffffffcc',
                })}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
      <Outlet context={{ applications, setApplications }} />
    </div>
  );
};