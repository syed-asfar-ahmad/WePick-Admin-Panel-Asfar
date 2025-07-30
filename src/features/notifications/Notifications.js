import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaFilter, FaTimes, FaUser, FaCalendar, FaEye, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Notifications.scss';
import Loading from '../../components/common/Loading';
import { getNotifications, getNotificationById } from '../../services/wepickApi';

const notificationTypes = [
  'All',
  'Parcel Dispatched',
  'Delivered',
  'Ready for Pickup',
];

const Notifications = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    type: 'All',
    user: 'All',
    date: ''
  });
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

  const handleApplyFilters = () => {
    setAppliedFilters({
      type: typeFilter,
      user: userFilter,
      date: dateFilter
    });
  };

  const filteredNotifications = notifications.filter((n) => {
    const typeMatch = appliedFilters.type === 'All' || n.type === appliedFilters.type;
    const userMatch = appliedFilters.user === 'All' || n.user?.name === appliedFilters.user;
    const dateMatch = !appliedFilters.date || n.createdAt === appliedFilters.date;
    return typeMatch && userMatch && dateMatch;
  });

  const handleResetFilters = () => {
    setTypeFilter('All');
    setUserFilter('All');
    setDateFilter('');
    setAppliedFilters({
      type: 'All',
      user: 'All',
      date: ''
    });
  };

  const handleViewNotification = async (notification) => {
    try {
      setIsLoadingDetail(true);
      setShowViewModal(true);
      
      // Fetch detailed notification data
      const response = await getNotificationById(notification.id);
      
      if (response?.data) {
        setSelectedNotification(response.data);
      } else {
        setSelectedNotification(notification);
      }
    } catch (err) {
      setSelectedNotification(notification);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedNotification(null);
  };

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getNotifications();
      
      // Handle different possible response structures
      let notificationsData = [];
      
      if (response?.data?.success && response.data.data?.notifications) {
        // Structure: { data: { success: true, data: { notifications: [...] } } }
        notificationsData = response.data.data.notifications;
      } else if (response?.data?.notifications) {
        // Structure: { data: { notifications: [...] } }
        notificationsData = response.data.notifications;
      } else if (response?.notifications) {
        // Structure: { notifications: [...] }
        notificationsData = response.notifications;
      } else if (Array.isArray(response?.data)) {
        // Structure: { data: [...] }
        notificationsData = response.data;
      } else if (Array.isArray(response)) {
        // Structure: [...] (direct array)
        notificationsData = response;
      } else {
        setError('Unexpected response format from server');
        return;
      }
      
      setNotifications(notificationsData);
      
    } catch (err) {
      // Provide more specific error messages
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error || 'Server error';
        
        if (status === 401) {
          setError('Authentication failed. Please login again.');
        } else if (status === 403) {
          setError('Access denied. You don\'t have permission to view notifications.');
        } else if (status === 404) {
          setError('Notifications endpoint not found. Please contact support.');
        } else if (status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Error ${status}: ${message}`);
        }
      } else if (err.request) {
        // Network error
        setError('Network error. Please check your internet connection.');
      } else {
        // Other error
        setError('Failed to fetch notifications. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Analytics data
  const analytics = {
    totalNotifications: notifications.length,
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
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className={`filters-section ${showFilters ? 'show' : 'hide'}`}>
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
                <option value="All">All</option>
                {Array.from(new Set(notifications.map(n => n.user?.name).filter(Boolean))).map(user => (
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
            <button 
              className="apply-button"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <Loading />
      ) : error ? (
        <div style={{ color: '#f44336', textAlign: 'center', marginTop: 40 }}>
          {error}
        </div>
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
                    <FaBell />
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{n.message}</div>
                    <div className="notification-meta">
                      <span className="notification-type">{n.type}</span>
                      <span className="notification-user">{n.user?.name || 'Unknown'}</span>
                      <span className="notification-date">{n.createdAt}</span>
                    </div>
                  </div>
                  <div className="notification-actions">
                    <button 
                      className="view-button"
                      onClick={() => handleViewNotification(n)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Notification Detail View Modal */}
      {showViewModal && (
        <div className="modal-overlay">
          <div className="notification-view-modal">
            <div className="modal-header">
              <h2>Notification Details</h2>
              <button className="close-button" onClick={handleCloseViewModal}>
                <FaTimes />
              </button>
            </div>
            
            {isLoadingDetail ? (
              <div className="loading-container">
                <Loading />
              </div>
            ) : selectedNotification ? (
              <div className="notification-detail-content">
                <div className="detail-section">
                  <h3>Basic Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>ID</label>
                      <span>{selectedNotification.id}</span>
                    </div>
                    <div className="detail-item">
                      <label>Title</label>
                      <span>{selectedNotification.title}</span>
                    </div>
                    <div className="detail-item">
                      <label>Type</label>
                      <span className={`type-badge ${selectedNotification.type}`}>
                        {selectedNotification.type}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <span className={`status-badge ${selectedNotification.isRead ? 'read' : 'unread'}`}>
                        <FaCheckCircle />
                        {selectedNotification.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Message</h3>
                  <div className="message-content">
                    <p>{selectedNotification.message}</p>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>User Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label><FaUser /> User ID</label>
                      <span>{selectedNotification.user?.id || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label><FaUser /> User Name</label>
                      <span>{selectedNotification.user?.name || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Timestamps</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label><FaCalendar /> Created At</label>
                      <span>{selectedNotification.createdAt || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label><FaCalendar /> Updated At</label>
                      <span>{selectedNotification.updatedAt || 'N/A'}</span>
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
    </div>
  );
};

export default Notifications; 