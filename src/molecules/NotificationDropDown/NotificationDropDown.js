import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationIcon from "../../assets/images/dashboard/NotificationIcon.svg";
import { useNotifications } from '../../context/NotificationsContext';
import { 
  IconButton, 
  Menu, 
  MenuItem,
  Box,
  Backdrop,
  Typography,
  Divider
} from '@mui/material';

const NotificationDropDown = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read when viewing
    markAsRead(notification.id);

    // Navigate based on notification type
    switch (notification.type) {
      case 'Parcel Dispatched':
      case 'Delivered':
        navigate(`/viewdispatchedparcels/${notification.id}`);
        break;
      case 'Ready for Pickup':
        navigate(`/listoflockers`);
        break;
      default:
        // For other types, just mark as read
        markAsRead(notification.id);
        break;
    }
    handleClose();
  };

  return (
    <div>
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
            width: '389px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            padding: '0.5rem 0',
            '& .MuiList-root': {
              padding: 0
            }
          }
        }}
      >
        <Box sx={{ 
          padding: '16px 20px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <Typography variant="h6" sx={{ 
            fontSize: '18px',
            fontWeight: 600,
            color: '#333'
          }}>
            Notifications
          </Typography>
        </Box>

        {notifications.length === 0 ? (
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
                  '&:hover': {
                    backgroundColor: 'rgba(108, 173, 97, 0.05)',
                    transform: 'translateX(4px)'
                  },
                  '&.unread': {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
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
                    color: '#6CAD61',
                    '& svg': {
                      color: '#6CAD61',
                      fontSize: '20px'
                    }
                  }}>
                    {notification.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ 
                      marginBottom: '4px',
                      fontSize: '14px',
                      color: '#333',
                      fontWeight: notification.isRead ? 400 : 600,
                      lineHeight: 1.4
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