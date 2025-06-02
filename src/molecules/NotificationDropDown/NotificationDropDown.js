import React from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NotificationIcon from "../../assets/images/dashboard/NotificationIcon.svg";
import { useNotifications } from '../../context/NotificationsContext';

const NotificationDropDown = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();

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
  };

  return (
    <div className="dropdown">
      <div
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        className="cursor-pointer menu-button p-4 mr-2 d-flex align-items-center justify-content-center position-relative"
      >
        <img src={NotificationIcon} alt="" />
      </div>

      <div
        className="notification-drop-down-body dropdown-menu"
        aria-labelledby="dropdownMenuButton"
      >
        {notifications.slice(0, 5).map((notification) => (
          <div 
            key={notification.id} 
            className={`row px-3 ${!notification.isRead ? 'unread' : ''}`}
            onClick={() => handleNotificationClick(notification)}
            style={{ cursor: 'pointer' }}
          >
            <div className="col-2 py-4 border-bottom">
              <div className="notification-icon">
                {notification.icon}
              </div>
            </div>
            <div className="col-10 py-4 border-bottom px-0 d-flex justify-content-center align-items-start flex-column">
              <p className="mb-1 pr-4 noti-drop-down-text1">
                {notification.message}
              </p>
              <p className="mb-0 noti-drop-down-text2">
                {notification.timeAgo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropDown;