import React, { createContext, useContext, useState } from 'react';
import { FaBox, FaCheckCircle, FaClock } from 'react-icons/fa';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'Parcel Dispatched',
      user: 'Calvin',
      message: 'A package is received by Calvin',
      date: '2024-06-01',
      timeAgo: '2 hours ago',
      icon: <FaBox />,
      isRead: false
    },
    {
      id: 2,
      type: 'Delivered',
      user: 'Sufian',
      message: 'Your Parcel is Delivered',
      date: '2024-06-02',
      timeAgo: '5 hours ago',
      icon: <FaCheckCircle />,
      isRead: false
    },
    {
      id: 3,
      type: 'Ready for Pickup',
      user: 'Ali',
      message: 'Ready for pickup at Locker 12',
      date: '2024-06-03',
      timeAgo: '1 day ago',
      icon: <FaClock />,
      isRead: false
    },
    {
      id: 4,
      type: 'Parcel Dispatched',
      user: 'Raza',
      message: 'A new package is booked by Raza',
      date: '2024-06-04',
      timeAgo: '2 days ago',
      icon: <FaBox />,
      isRead: false
    }
  ]);

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

  const value = {
    notifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}; 