import React, { useState } from "react";

// png
// import SampleImg from "../../assets/images/dashboard/user_icon.png";
// import SampleImg from "../../assets/images/profile.png";
import { DummyUserProfile, Logout } from "../../assets/icons";
// svg
// eslint-disable-next-line no-unused-vars
import ClockIcon from "../../assets/images/dashboard/ClockIcon.svg";
// eslint-disable-next-line no-unused-vars
import LogoutIcon from "../../assets/images/dashboard/LogoutIcon.svg";

import { useDispatch, useSelector } from "react-redux";
import { clearAuthentication } from "../../redux/feature/AuthSlice";
import { useNavigate } from "react-router-dom";
import { signout } from "../../services/wepickApi";

const ProfileDropDown = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get image base URL with fallback
  const getImageBaseUrl = () => {
    return process.env.REACT_APP_IMAGE_BASE_URL || 'http://35.183.208.209';
  };

  // Get image URL with cache busting
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const normalizedPath = imagePath.replace(/\\/g, '/');
    const baseUrl = getImageBaseUrl();
    const timestamp = Date.now();
    return `${baseUrl}/${normalizedPath}?t=${timestamp}`;
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signout();
      dispatch(clearAuthentication());
      localStorage.removeItem("token");
      window.location.href = "/signin";
    } catch (error) {
      // Still clear local state even if API call fails
      dispatch(clearAuthentication());
      localStorage.removeItem("token");
      window.location.href = "/signin";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="profile-dropdown-container">
      <div
        className="profile-trigger"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{
          cursor: 'pointer'
        }}
      >
                 {(user?.profileImage || user?.profile_pic) ? (
           <img
             src={getImageUrl(user.profileImage || user.profile_pic)}
             className="profile-image"
             alt="Profile"
             style={{
               width: '40px',
               height: '40px',
               borderRadius: '50%',
               objectFit: 'cover',
               border: '2px solid #fff',
               boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
             }}
             onError={(e) => {
               // Image failed to load
             }}
             onLoad={() => {
               // Image loaded successfully
             }}
           />
         ) : (
          <div style={{ transform: 'scale(1.1)' }}>
            <DummyUserProfile />
          </div>
        )}
      </div>

      {isDropdownOpen && (
        <>
          <div 
            className="dropdown-backdrop"
            onClick={() => setIsDropdownOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              animation: 'fadeIn 0.2s ease-out',
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          />
          <div
            className="profile-dropdown-menu"
            style={{
              position: 'absolute',
              right: '5px',
              top: '60px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              width: '320px',
              zIndex: 1001,
              animation: 'slideDown 0.3s ease-out',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05) inset'
            }}
          >
            <div className="profile-section" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {(user?.profileImage || user?.profile_pic) ? (
                    <img
                      src={getImageUrl(user.profileImage || user.profile_pic)}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        // Image failed to load
                      }}
                      onLoad={() => {
                        // Image loaded successfully
                      }}
                    />
                  ) : (
                    <DummyUserProfile size="60px" />
                  )}
                </div>
                <div>
                  <h3 style={{ 
                    margin: '0 0 4px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    {user?.name || 'User'}
                  </h3>
                  <p style={{ 
                    margin: 0,
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: '500'
                  }}>
                    {user?.role || 'User Role'}
                  </p>
                </div>
              </div>
            </div>

            <div className="dropdown-divider" style={{ 
              height: '1px',
              backgroundColor: '#f0f0f0',
              margin: '8px 0'
            }} />

            <div className="menu-items" style={{ padding: '8px' }}>
              <button
                onClick={() => {
                  navigate("/editprofile");
                  setIsDropdownOpen(false);
                }}
                className="menu-item"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#6CAD61',
                  fontSize: '15px',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f0f7f0';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6CAD61" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <span style={{ lineHeight: '1' }}>Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowLogoutModal(true);
                  setIsDropdownOpen(false);
                }}
                className="menu-item"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#dc3545',
                  fontSize: '15px',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#fff5f5';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <Logout style={{ width: '24px', height: '24px' }} />
                <span style={{ lineHeight: '1' }}>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Modern Logout Confirmation Modal */}
      {showLogoutModal && (
        <div 
          className="modal-backdrop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          <div 
            className="modal-content"
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              width: '90%',
              maxWidth: '420px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              animation: 'modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            <div style={{ padding: '32px 24px 24px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: '28px'
              }}>
                <Logout width="60" height="60" style={{ 
                  color: '#dc3545',
                  animation: 'iconPop 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>

              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h4 style={{ 
                  margin: '0 0 16px 0',
                  color: '#1a1a1a',
                  fontSize: '26px',
                  fontWeight: '600',
                  letterSpacing: '-0.5px',
                  animation: 'fadeInUp 0.5s ease-out 0.1s both'
                }}>
                  Confirm Logout
                </h4>
                <p style={{ 
                  margin: 0,
                  color: '#666',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  maxWidth: '320px',
                  margin: '0 auto',
                  animation: 'fadeInUp 0.5s ease-out 0.2s both'
                }}>
                  Are you sure you want to log out? You'll need to log in again to access your account.
                </p>
              </div>
              
              <div style={{ 
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                animation: 'fadeInUp 0.5s ease-out 0.3s both'
              }}>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  style={{
                    padding: '14px 32px',
                    borderRadius: '14px',
                    border: '1px solid #e0e0e0',
                    backgroundColor: 'white',
                    color: '#666',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '130px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    transform: 'translateY(0)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f8f8f8';
                    e.target.style.borderColor = '#d0d0d0';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '14px 32px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%)',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '130px',
                    boxShadow: '0 4px 12px rgba(220, 53, 69, 0.2)',
                    transform: 'translateY(0)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(220, 53, 69, 0.25)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.2)';
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { 
              opacity: 0;
            }
            to { 
              opacity: 1;
            }
          }
          
          @keyframes slideIn {
            from { 
              transform: translateY(-30px);
              opacity: 0;
            }
            to { 
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes slideDown {
            from {
              transform: translateY(-10px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes modalSlideIn {
            from {
              transform: translateY(20px) scale(0.95);
              opacity: 0;
            }
            to {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }

          @keyframes iconPop {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ProfileDropDown;
