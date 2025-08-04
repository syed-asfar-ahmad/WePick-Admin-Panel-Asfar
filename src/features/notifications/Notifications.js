import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes, FaUser, FaCalendar, FaEye, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Notifications.scss';
import Loading from '../../components/common/Loading';
import { getNotifications, getNotificationById } from '../../services/wepickApi';

const Notifications = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotificationsCount, setTotalNotificationsCount] = useState(0);
  const [pageSize] = useState(20);

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

  const fetchNotifications = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getNotifications(page);
      
      // Handle different possible response structures
      let notificationsData = [];
      let totalCount = 0;
      let currentPageFromAPI = page;
      let totalPagesFromAPI = 1;
      
      if (response?.data?.success && response.data.data?.notifications) {
        // Structure: { data: { success: true, data: { notifications: [...], totalNotificationsCount, currentPage, totalPages } } }
        notificationsData = response.data.data.notifications;
        totalCount = response.data.data.totalNotificationsCount || notificationsData.length;
        currentPageFromAPI = response.data.data.currentPage || page;
        totalPagesFromAPI = response.data.data.totalPages || Math.ceil(totalCount / pageSize);
      } else if (response?.data?.notifications) {
        // Structure: { data: { notifications: [...], totalNotificationsCount, currentPage, totalPages } }
        notificationsData = response.data.notifications;
        totalCount = response.data.totalNotificationsCount || notificationsData.length;
        currentPageFromAPI = response.data.currentPage || page;
        totalPagesFromAPI = response.data.totalPages || Math.ceil(totalCount / pageSize);
      } else if (response?.notifications) {
        // Structure: { notifications: [...], totalNotificationsCount, currentPage, totalPages }
        notificationsData = response.notifications;
        totalCount = response.totalNotificationsCount || notificationsData.length;
        currentPageFromAPI = response.currentPage || page;
        totalPagesFromAPI = response.totalPages || Math.ceil(totalCount / pageSize);
      } else if (Array.isArray(response?.data)) {
        // Structure: { data: [...] }
        notificationsData = response.data;
        totalCount = notificationsData.length;
        currentPageFromAPI = page;
        totalPagesFromAPI = Math.ceil(totalCount / pageSize);
      } else if (Array.isArray(response)) {
        // Structure: [...] (direct array)
        notificationsData = response;
        totalCount = notificationsData.length;
        currentPageFromAPI = page;
        totalPagesFromAPI = Math.ceil(totalCount / pageSize);
      } else {
        setError('Unexpected response format from server');
        return;
      }
      
      // Update pagination state
      setCurrentPage(currentPageFromAPI);
      setTotalPages(totalPagesFromAPI);
      setTotalNotificationsCount(totalCount);
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

  // Fetch notifications for specific page
  const fetchNotificationsForPage = async (page) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getNotifications(page);
      
      // Handle different possible response structures
      let notificationsData = [];
      let totalCount = 0;
      let currentPageFromAPI = page;
      let totalPagesFromAPI = 1;
      
      if (response?.data?.success && response.data.data?.notifications) {
        // Structure: { data: { success: true, data: { notifications: [...], totalNotificationsCount, currentPage, totalPages } } }
        notificationsData = response.data.data.notifications;
        totalCount = response.data.data.totalNotificationsCount || notificationsData.length;
        currentPageFromAPI = response.data.data.currentPage || page;
        totalPagesFromAPI = response.data.data.totalPages || Math.ceil(totalCount / pageSize);
      } else if (response?.data?.notifications) {
        // Structure: { data: { notifications: [...], totalNotificationsCount, currentPage, totalPages } }
        notificationsData = response.data.notifications;
        totalCount = response.data.totalNotificationsCount || notificationsData.length;
        currentPageFromAPI = response.data.currentPage || page;
        totalPagesFromAPI = response.data.totalPages || Math.ceil(totalCount / pageSize);
      } else if (response?.notifications) {
        // Structure: { notifications: [...], totalNotificationsCount, currentPage, totalPages }
        notificationsData = response.notifications;
        totalCount = response.totalNotificationsCount || notificationsData.length;
        currentPageFromAPI = response.currentPage || page;
        totalPagesFromAPI = response.totalPages || Math.ceil(totalCount / pageSize);
      } else if (Array.isArray(response?.data)) {
        // Structure: { data: [...] }
        notificationsData = response.data;
        totalCount = notificationsData.length;
        currentPageFromAPI = page;
        totalPagesFromAPI = Math.ceil(totalCount / pageSize);
      } else if (Array.isArray(response)) {
        // Structure: [...] (direct array)
        notificationsData = response;
        totalCount = notificationsData.length;
        currentPageFromAPI = page;
        totalPagesFromAPI = Math.ceil(totalCount / pageSize);
      } else {
        setError('Unexpected response format from server');
        return;
      }
      
      // Update pagination state
      setCurrentPage(currentPageFromAPI);
      setTotalPages(totalPagesFromAPI);
      setTotalNotificationsCount(totalCount);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchNotificationsForPage(page);
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
      </div>

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
            {notifications.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
                No notifications found.
              </div>
            ) : (
              notifications.map(n => (
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
          
          {/* Server-side Pagination */}
          {notifications.length > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                {totalPages > 1 
                  ? `Showing ${((currentPage - 1) * pageSize) + 1} to ${Math.min(currentPage * pageSize, totalNotificationsCount)} of ${totalNotificationsCount} notifications`
                  : `Showing ${totalNotificationsCount} of ${totalNotificationsCount} notifications`
                }
              </div>
              {totalPages > 1 && (
              <div className="pagination-controls">
                <button 
                  className="pagination-btn prev-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span>←</span> Previous
                </button>
                <div className="page-numbers">
                  {currentPage > 2 && (
                    <button 
                      className="pagination-btn page-btn"
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                  )}
                  {currentPage > 3 && <span className="page-dots">...</span>}
                  {currentPage > 1 && (
                    <button 
                      className="pagination-btn page-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </button>
                  )}
                  <button 
                    className="pagination-btn page-btn active"
                    disabled
                  >
                    {currentPage}
                  </button>
                  {currentPage < totalPages && (
                    <button 
                      className="pagination-btn page-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </button>
                  )}
                  {currentPage < totalPages - 2 && <span className="page-dots">...</span>}
                  {currentPage < totalPages - 1 && (
                    <button 
                      className="pagination-btn page-btn"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>
                <button 
                  className="pagination-btn next-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next <span>→</span>
                </button>
              </div>
              )}
            </div>
          )}
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