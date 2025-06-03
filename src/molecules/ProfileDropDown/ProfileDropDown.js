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

const ProfileDropDown = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(clearAuthentication());
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  return (
    <div className="dropdown">
      <div
        className="profile-menu-button-right-img"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {user?.profile_pic ? (
          <img
            src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${user.profile_pic}`}
            className="menu-button-right-img menu-button"
            alt=""
          />
        ) : (
          <DummyUserProfile />
        )}
      </div>

      <div
        className="profile-drop-down-body dropdown-menu py-2"
        aria-labelledby="dropdownMenuButton"
        style={{ boxShadow: "0px 1px 14px 0px rgba(0, 0, 0, 0.08)" }}
      >
        <div className="row py-2 px-3">
          <div className="col-4">
            <DummyUserProfile size={"31px"} />
          </div>

          <div className="col-8 px-2 d-flex justify-content-center align-items-start flex-column">
            <p className="mb-0 profile-drop-down-text1">{user?.role}</p>
            <button 
              className="btn btn-link p-0 text-decoration-none profile-drop-down-text2"
              onClick={() => navigate("/editprofile")}
              style={{ color: "#6CAD61" }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div
          className="row pb-0 pt-2 px-3"
          onClick={() => setShowLogoutModal(true)}
          style={{ cursor: 'pointer' }}
        >
          <div className="col-4">
            <Logout />
          </div>
          <div className="col-8 px-2 d-flex align-items-center">
            <span className="mb-0 profile-drop-down-text1 cursor-pointer text-danger">
              Logout
            </span>
          </div>
        </div>
      </div>

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
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            animation: 'fadeIn 0.3s ease-in-out',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div 
            className="modal-content"
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '90%',
              maxWidth: '420px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '32px 24px 24px' }}>
              {/* Icon Container */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#fff5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 4px 12px rgba(220, 53, 69, 0.15)'
              }}>
                <Logout style={{ width: '32px', height: '32px', color: '#dc3545' }} />
              </div>

              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h4 style={{ 
                  margin: '0 0 12px 0',
                  color: '#1a1a1a',
                  fontSize: '24px',
                  fontWeight: '600',
                  letterSpacing: '-0.5px'
                }}>
                  Confirm Logout
                </h4>
                <p style={{ 
                  margin: 0,
                  color: '#666',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  maxWidth: '320px',
                  margin: '0 auto'
                }}>
                  Are you sure you want to log out? You'll need to log in again to access your account.
                </p>
              </div>
              
              <div style={{ 
                display: 'flex',
                gap: '16px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    backgroundColor: 'white',
                    color: '#666',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '120px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f8f8f8';
                    e.target.style.borderColor = '#d0d0d0';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#e0e0e0';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%)',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '120px',
                    boxShadow: '0 4px 12px rgba(220, 53, 69, 0.2)'
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
              backdrop-filter: blur(0px);
            }
            to { 
              opacity: 1;
              backdrop-filter: blur(4px);
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
        `}
      </style>
    </div>
  );
};

export default ProfileDropDown;
