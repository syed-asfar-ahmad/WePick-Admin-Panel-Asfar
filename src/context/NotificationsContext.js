import React, { createContext, useContext, useState, useEffect } from 'react';
import { FaBox, FaCheckCircle, FaClock } from 'react-icons/fa';
import { getNotifications } from '../services/wepickApi';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  // Default empty array for notifications
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Function to get icon based on notification type
  const getNotificationIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'parcel dispatched':
      case 'dispatch':
      case 'dispatched':
        return <FaBox />;
      case 'delivered':
      case 'delivery':
        return <FaCheckCircle />;
      case 'ready for pickup':
      case 'pickup':
        return <FaClock />;
      default:
        return <FaBox />;
    }
  };
  
  // Function to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    
    if (diffMins < 60) {
      return diffMins <= 1 ? 'just now' : `${diffMins} minutes ago`;
    } else if (diffHrs < 24) {
      return diffHrs === 1 ? '1 hour ago' : `${diffHrs} hours ago`;
    } else {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    }
  };

  const markAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.isRead).length;
  };
  
  // Function to fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNotifications();
      
      if (response?.data?.success || response?.success) {
        // Get the notifications array - check all possible paths where it might be located
        const notificationData = 
          response?.data?.notifications || // Check if nested under data.notifications
          response?.data?.data?.notifications || // Check if nested deeper
          response?.notifications || // Check direct path
          response?.data?.data || // Check traditional data path
          response?.data || // Check direct data
          []; // Default empty array
        
        // Transform API data to match our notification format
        const formattedNotifications = notificationData.map(item => ({
          id: item.id || item._id,
          type: item.type || 'Notification',
          message: item.message || item.content || 'New notification',
          date: item.createdAt || item.date || new Date().toISOString(),
          timeAgo: formatTimeAgo(item.createdAt || item.date || new Date()),
          icon: getNotificationIcon(item.type),
          isRead: item.isRead || false,
          data: item // Keep original data for reference
        }));
        
        setNotifications(formattedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      setError('Failed to load notifications');
      // Keep existing notifications on error
    } finally {
      setLoading(false);
    }
  };

  const value = {
    notifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    fetchNotifications,
    loading,
    error
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}; 