import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationIcon from "../../assets/images/dashboard/NotificationIcon.svg";
import { useNotifications } from '../../context/NotificationsContext';
import { getNotificationById } from '../../services/wepickApi';
import { 
  IconButton, 
  Menu, 
  MenuItem,
  Box,
  Backdrop,
  Typography,
  Divider,
  CircularProgress
} from '@mui/material';
import { FaTimes, FaUser, FaCalendar, FaCheckCircle, FaBell } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import '../../features/notifications/Notifications.scss';

const NotificationDropDown = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    fetchNotifications,
    getUnreadCount,
    loading,
    error
  } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationDetailsLoading, setNotificationDetailsLoading] = useState(false);
  const [notificationDetailsError, setNotificationDetailsError] = useState(null);
  const [notificationDetails, setNotificationDetails] = useState(null);

  // Fetch notifications when dropdown is opened
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
    setIsFirstLoad(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to fetch notification details
  const fetchNotificationDetails = async (notificationId) => {
    setNotificationDetailsLoading(true);
    setNotificationDetailsError(null);
    
    try {
      const response = await getNotificationById(notificationId);
      
      if (response?.success || response?.data?.success) {
        const details = response?.data?.data || response?.data || {};
        setNotificationDetails(details);
      } else {
        setNotificationDetailsError('Failed to load notification details');
      }
    } catch (error) {
      setNotificationDetailsError('Error loading notification details');
    } finally {
      setNotificationDetailsLoading(false);
    }
  };

  // Handle closing the notification details dialog
  const handleCloseDialog = () => {
    setSelectedNotification(null);
    setNotificationDetails(null);
    setNotificationDetailsError(null);
  };
  
  const handleNotificationClick = (notification) => {
    // Mark as read when viewing
    markAsRead(notification.id);

    // Get the original API notification data if available
    const originalData = notification.data || notification;
    const notificationId = originalData.id || originalData._id;
    
    // Set selected notification and fetch details
    setSelectedNotification(notification);
    fetchNotificationDetails(notificationId);
    
    // Close the dropdown menu
    handleClose();
  };

  return (
    <div>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={handleClick}
          sx={{
            padding: '16px',
            marginRight: '8px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#F5F5F5',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(108, 173, 97, 0.08)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
            },
            '& img': {
              width: '20px',
              height: '20px'
            }
          }}
        >
          <img src={NotificationIcon} alt="Notifications" />
        </IconButton>
        
        {/* Notification badge */}
        {getUnreadCount() > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: '#FF5252',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
              border: '2px solid white'
            }}
          >
            {getUnreadCount() > 9 ? '9+' : getUnreadCount()}
          </Box>
        )}
      </Box>
      
      {/* Notification Details Dialog */}
      {selectedNotification && (
        <div className="modal-overlay">
          <div className="notification-view-modal">
            <div className="modal-header">
              <h2>Notification Details</h2>
              <button className="close-button" onClick={handleCloseDialog}>
                <FaTimes />
              </button>
            </div>
            
            {notificationDetailsLoading ? (
              <div className="loading-container">
                <Loading />
              </div>
            ) : notificationDetails ? (
              <div className="notification-detail-content">
                <div className="detail-section">
                  <h3>Basic Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>ID</label>
                      <span>{notificationDetails.id || selectedNotification.id || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Title</label>
                      <span>{notificationDetails.title || selectedNotification.title || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Type</label>
                      <span className={`type-badge ${(notificationDetails.type || selectedNotification.type || '').toLowerCase()}`}>
                        {notificationDetails.type || selectedNotification.type || 'N/A'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <span className={`status-badge ${notificationDetails.isRead ? 'read' : 'unread'}`}>
                        <FaCheckCircle />
                        {notificationDetails.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Message</h3>
                  <div className="message-content">
                    <p>{notificationDetails.message || selectedNotification.message}</p>
                  </div>
                </div>

                {(notificationDetails.user || selectedNotification.user) && (
                  <div className="detail-section">
                    <h3>User Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label><FaUser /> User ID</label>
                        <span>{(notificationDetails.user?.id || selectedNotification.user?.id) || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <label><FaUser /> User Name</label>
                        <span>{(notificationDetails.user?.name || selectedNotification.user?.name) || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="detail-section">
                  <h3>Timestamps</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label><FaCalendar /> Created At</label>
                      <span>{notificationDetails.createdAt || selectedNotification.createdAt || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label><FaCalendar /> Updated At</label>
                      <span>{notificationDetails.updatedAt || selectedNotification.updatedAt || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="error-container">
                <p>No notification data available</p>
              </div>
            )}
          </div>
        </div>
      )}


      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            position: 'absolute',
            right: '5px',
            top: '60px',
            backgroundColor: 'white',
            borderRadius: '16px',
            width: {
              xs: '95vw', // Mobile width
              sm: '500px', // Tablet and up
              md: '550px'  // Desktop
            },
            maxWidth: '600px',
            maxHeight: '80vh',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            padding: '0.5rem 0',
            overflowY: 'auto',
            '& .MuiList-root': {
              padding: 0
            }
          }
        }}
      >
        <Box sx={{ 
          padding: '16px 20px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ 
            fontSize: '18px',
            fontWeight: 600,
            color: '#333'
          }}>
            Notifications
          </Typography>
          
          {/* Refresh button */}
          {!isFirstLoad && !loading && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                fetchNotifications();
              }}
              sx={{
                cursor: 'pointer',
                color: '#6CAD61',
                display: 'flex',
                alignItems: 'center',
                fontSize: '13px',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              <span style={{ marginLeft: '4px' }}>Refresh</span>
            </Box>
          )}
        </Box>

        {loading ? (
          <Box sx={{ 
            padding: '32px 20px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <CircularProgress size={28} sx={{ color: '#6CAD61' }} />
            <Typography sx={{ 
              color: '#666',
              fontSize: '14px'
            }}>
              Loading notifications...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ 
            padding: '32px 20px',
            textAlign: 'center'
          }}>
            <Typography sx={{ 
              color: '#dc3545',
              fontSize: '14px'
            }}>
              {error}
            </Typography>
            <Typography 
              sx={{ 
                color: '#6CAD61', 
                fontSize: '13px', 
                marginTop: '8px',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                fetchNotifications();
              }}
            >
              Try again
            </Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ 
            padding: '32px 20px',
            textAlign: 'center'
          }}>
            <Typography sx={{ 
              color: '#666',
              fontSize: '14px'
            }}>
              No new notifications
            </Typography>
          </Box>
        ) : (
          notifications.slice(0, 5).map((notification, index) => (
            <React.Fragment key={notification.id}>
              <MenuItem
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  padding: '16px 20px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  width: '100%',
                  whiteSpace: 'normal', // Allow text to wrap
                  '&:hover': {
                    backgroundColor: 'rgba(108, 173, 97, 0.05)',
                    transform: 'translateX(4px)'
                  },
                  '&.unread': {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      right: '20px',
                      top: '16px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#6CAD61',
                      borderRadius: '50%',
                      boxShadow: '0 0 0 2px rgba(108, 173, 97, 0.2)'
                    }
                  }
                }}
                className={!notification.isRead ? 'unread' : ''}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <Box sx={{ 
                    marginRight: '16px',
                    marginTop: '3px', // Align icon with first line of text
                    color: '#6CAD61',
                    minWidth: '24px', // Ensure consistent width
                    '& svg': {
                      color: '#6CAD61',
                      fontSize: '20px'
                    }
                  }}>
                    {notification.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden', width: 'calc(100% - 40px)' }}>
                    <Box sx={{ 
                      marginBottom: '4px',
                      fontSize: '14px',
                      color: '#333',
                      fontWeight: notification.isRead ? 400 : 600,
                      lineHeight: 1.5,
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      display: '-webkit-box',
                      WebkitLineClamp: 3, // Limit to 3 lines
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {notification.message}
                    </Box>
                    <Box sx={{ 
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {notification.timeAgo}
                    </Box>
                  </Box>
                </Box>
              </MenuItem>
              {index < notifications.slice(0, 5).length - 1 && (
                <Divider sx={{ 
                  margin: '0 20px',
                  borderColor: 'rgba(0, 0, 0, 0.08)'
                }} />
              )}
            </React.Fragment>
          ))
        )}
      </Menu>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}
        open={Boolean(anchorEl)}
        onClick={handleClose}
      />
    </div>
  );
};

export default NotificationDropDown;