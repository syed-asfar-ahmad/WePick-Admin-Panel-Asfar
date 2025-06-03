import React, { useState, useRef,useEffect } from 'react';
import { FaBell, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationsContext';
import './Notifications.scss';
import Loading from '../components/common/Loading';


const notificationTypes = [
  'All',
  'Parcel Dispatched',
  'Delivered',
  'Ready for Pickup',
];

const users = ['All', 'Calvin', 'Sufian', 'Ali', 'Raza'];

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, getUnreadCount } = useNotifications();
  const [showFilters, setShowFilters] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const filtersRef = useRef(null);

  const handleFilterToggle = () => {
    if (showFilters) {
      setIsClosing(true);
      setTimeout(() => {
        setShowFilters(false);
        setIsClosing(false);
      }, 300);
    } else {
      setShowFilters(true);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    const typeMatch = typeFilter === 'All' || n.type === typeFilter;
    const userMatch = userFilter === 'All' || n.user === userFilter;
    const dateMatch = !dateFilter || n.date === dateFilter;
    return typeMatch && userMatch && dateMatch;
  });

  const handleResetFilters = () => {
    setTypeFilter('All');
    setUserFilter('All');
    setDateFilter('');
  };

  const handleViewNotification = (notification) => {
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

  const handleMarkAsRead = (e, notificationId) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    markAsRead(notificationId);
  };

  useEffect(() => {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
  }, []);

  // Analytics data
  const analytics = {
    totalNotifications: notifications.length,
    unreadNotifications: getUnreadCount(),
    todayNotifications: notifications.filter(n => n.date === new Date().toISOString().split('T')[0]).length
  };

  return (
    <div className="notifications-container">
      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <div className="analytics-card">
          <FaBell />
          <div className="analytics-info">
            <h3>Total Notifications</h3>
            <p>{isLoading ? "..." : analytics.totalNotifications}</p>
          </div>
        </div>
        <div className="analytics-card">
          <FaBell />
          <div className="analytics-info">
            <h3>Unread</h3>
            <p>{isLoading ? "..." : analytics.unreadNotifications}</p>
          </div>
        </div>
        <div className="analytics-card">
          <FaBell />
          <div className="analytics-info">
            <h3>Today</h3>
            <p>{isLoading ? "..." : analytics.todayNotifications}</p>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <h1>Notifications</h1>
        <div className="header-actions">
          <button 
            className="filter-button"
            onClick={handleFilterToggle}
          >
            <FaFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button 
            className="mark-all-read-button"
            onClick={markAllAsRead}
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div 
          ref={filtersRef}
          className={`filters-section ${isClosing ? 'closing' : ''}`}
        >
          <div className="filters-grid">
            <div className="filter-group">
              <label>Notification Type</label>
              <select 
                value={typeFilter} 
                onChange={e => setTypeFilter(e.target.value)}
              >
                {notificationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>User</label>
              <select 
                value={userFilter} 
                onChange={e => setUserFilter(e.target.value)}
              >
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Date</label>
              <input 
                type="date" 
                value={dateFilter} 
                onChange={e => setDateFilter(e.target.value)} 
              />
            </div>
          </div>
          <div className="filter-actions">
            <button 
              className="reset-button"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <>
        <Loading />
        </>
      ) : (
        <>
      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
            No notifications found.
          </div>
        ) : (
          filteredNotifications.map(n => (
            <div 
              key={n.id} 
              className={`notification-item ${!n.isRead ? 'unread' : ''}`}
            >
              <div className="notification-icon">
                {n.icon}
              </div>
              <div className="notification-content">
                <div className="notification-title">{n.message}</div>
                <div className="notification-meta">
                  <span className="notification-type">{n.type}</span>
                  <span className="notification-user">{n.user}</span>
                  <span className="notification-date">{n.date}</span>
                  <span className="notification-time">{n.timeAgo}</span>
                </div>
              </div>
              <div className="notification-actions">
                <button 
                  className="view-button"
                  onClick={() => handleViewNotification(n)}
                >
                  View
                </button>
                {!n.isRead && (
                  <button 
                    className="mark-read-button"
                    onClick={(e) => handleMarkAsRead(e, n.id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default Notifications; 