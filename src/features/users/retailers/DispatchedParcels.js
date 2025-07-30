import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaTimes, FaMapMarkerAlt, FaUser, FaStore, FaHistory, FaSpinner, FaExclamationTriangle, FaBarcode, FaClipboardCheck, FaWeightHanging, FaUserFriends, FaUserCircle, FaIdCard, FaWarehouse, FaLocationArrow, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './DispatchedParcels.scss';
import Loading from '../../../components/common/Loading';
import { getDispatchedParcels, getDispatchedParcelById, updateDispatchedParcelById } from '../../../services/wepickApi';

const DispatchedParcels = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [updatesSupported, setUpdatesSupported] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: '',
    status: '',
    parcelId: '',
    retailer: '',
    customer: '',
    lockerId: '',
    size: '',
    priority: '',
    timeRange: ''
  });

  // Helper function to format date for HTML date input
  const formatDateForInput = (dateString) => {
    if (!dateString) {
      return '';
    }
    
    try {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // Try to parse as a date
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      const formatted = date.toISOString().split('T')[0];
      return formatted;
    } catch (error) {
      return dateString;
    }
  };

  // Fetch dispatched parcels from API
  const fetchParcels = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getDispatchedParcels();
      
      // Extract parcels array from the correct nested structure
      const parcelsData = response.data?.parcels || response.data?.data || response.data || [];
      
      // Store total count from API
      setTotalCount(response.data?.totalCount || 0);
      
      setParcels(parcelsData);
    } catch (err) {
      setError('Failed to load dispatched parcels. Please try again.');
      setParcels([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  // Analytics data
  const analytics = {
    totalToday: 156,
    avgDeliveryTime: '2.5 hours',
    topRetailers: [
      { name: 'Tech Gadgets Store', count: 45 },
      { name: 'Fashion Boutique', count: 38 },
      { name: 'Home Essentials', count: 32 }
    ],
    statusBreakdown: {
      delivered: 65,
      inTransit: 25,
      pending: 15,
      failed: 5
    }
  };

  // Locker locations data
  const lockerLocations = [
    { id: 'L789', name: 'Downtown Hub', lat: 37.7749, lng: -122.4194, parcels: 12 },
    { id: 'L456', name: 'Westside Center', lat: 37.7833, lng: -122.4167, parcels: 8 },
    { id: 'L234', name: 'Eastside Station', lat: 37.7855, lng: -122.4067, parcels: 15 },
    { id: 'L567', name: 'North Terminal', lat: 37.7895, lng: -122.4000, parcels: 10 },
    { id: 'L890', name: 'South Point', lat: 37.7800, lng: -122.4100, parcels: 7 }
  ];

  // Timeline data
  const timelineData = {
    '2024-03-17': {
      total: 45,
      delivered: 35,
      inTransit: 7,
      pending: 3
    },
    '2024-03-16': {
      total: 38,
      delivered: 30,
      inTransit: 5,
      pending: 3
    },
    '2024-03-15': {
      total: 42,
      delivered: 32,
      inTransit: 8,
      pending: 2
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: '',
      status: '',
      parcelId: '',
      retailer: '',
      customer: '',
      lockerId: '',
      size: '',
      priority: '',
      timeRange: ''
    });
  };

  const handleApplyFilters = () => {
    const filteredCount = getFilteredParcels().length;
    alert(`Found ${filteredCount} parcels matching your criteria`);
  };

  const getFilteredParcels = () => {
    // Ensure parcels is always an array
    if (!Array.isArray(parcels)) {
      return [];
    }

    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    if (!hasActiveFilters) {
      return parcels;
    }

    return parcels.filter(parcel => {
      if (filters.parcelId && !parcel.parcelId.toLowerCase().includes(filters.parcelId.toLowerCase())) {
        return false;
      }
      if (filters.retailer && !(parcel.senderName || parcel.from || '').toLowerCase().includes(filters.retailer.toLowerCase())) {
        return false;
      }
      if (filters.customer && !(parcel.recipientName || parcel.to || '').toLowerCase().includes(filters.customer.toLowerCase())) {
        return false;
      }
      if (filters.lockerId && !parcel.from.toLowerCase().includes(filters.lockerId.toLowerCase())) {
        return false;
      }

      // Exact match filters
      if (filters.status && parcel.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
      if (filters.size && parcel.weight.toLowerCase() !== filters.size.toLowerCase()) {
        return false;
      }
      if (filters.priority && parcel.parcelName.toLowerCase() !== filters.priority.toLowerCase()) {
        return false;
      }

      // Date Range filter
      if (filters.dateRange) {
        const parcelDate = new Date(parcel.date);
        const filterDate = new Date(filters.dateRange);
        if (parcelDate < filterDate) {
          return false;
        }
      }

      // Time Range filter
      if (filters.timeRange) {
        const parcelDate = new Date(parcel.date);
        const now = new Date();
        const diffTime = Math.abs(now - parcelDate);
        const diffHours = diffTime / (1000 * 60 * 60);

        switch (filters.timeRange) {
          case '24h':
            if (diffHours > 24) return false;
            break;
          case 'week':
            if (diffHours > 168) return false; // 7 days
            break;
          case 'month':
            if (diffHours > 720) return false; // 30 days
            break;
        }
      }

      return true;
    });
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered':
        return '#4CAF50';
      case 'in transit':
        return '#2196F3';
      case 'pending':
        return '#FFC107';
      case 'failed':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const handleEditParcel = async (parcel) => {
    try {
      setIsLoading(true);
      const response = await getDispatchedParcelById(parcel.id);
      if (response?.success && response?.data) {
        setSelectedParcel(response.data);
        setShowEditModal(true);
      } else {
        // Fallback to basic parcel data if API call fails
        setSelectedParcel(parcel);
        setShowEditModal(true);
      }
    } catch (err) {
      console.error('Failed to load parcel details for editing:', err);
      // Fallback to basic parcel data if API call fails
      setSelectedParcel(parcel);
      setShowEditModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // Create a clean update data object with only non-empty values
      const updateData = {};
      
      // Parcel Information
      if (selectedParcel.parcelName) updateData.parcelName = selectedParcel.parcelName;
      if (selectedParcel.weight) updateData.weight = selectedParcel.weight;
      if (selectedParcel.status) updateData.status = selectedParcel.status;
      
      // Sender Information
      if (selectedParcel.senderName) updateData.senderName = selectedParcel.senderName;
      if (selectedParcel.senderInfo) {
        updateData.senderInfo = {};
        if (selectedParcel.senderInfo.businessName) updateData.senderInfo.businessName = selectedParcel.senderInfo.businessName;
        if (selectedParcel.senderInfo.phoneNumber) updateData.senderInfo.phoneNumber = selectedParcel.senderInfo.phoneNumber;
      }
      
      // Recipient Information
      if (selectedParcel.recipientName) updateData.recipientName = selectedParcel.recipientName;
      if (selectedParcel.recipientEmail) updateData.recipientEmail = selectedParcel.recipientEmail;
      if (selectedParcel.recipientPhone) updateData.recipientPhone = selectedParcel.recipientPhone;
      
      // Location Information
      if (selectedParcel.from) updateData.from = selectedParcel.from;
      if (selectedParcel.to) updateData.to = selectedParcel.to;
      
      const response = await updateDispatchedParcelById(selectedParcel.id, updateData);
      
      if (response?.success) {
        setShowEditModal(false);
        setSelectedParcel(null);
        fetchParcels(); // Refresh list after edit
      } else {
        throw new Error('Failed to update parcel');
      }
    } catch (err) {
      console.error('❌ Update error:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      setError('Failed to update parcel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested senderInfo fields
    if (name.startsWith('senderInfo.')) {
      const field = name.split('.')[1];
      setSelectedParcel(prev => ({
        ...prev,
        senderInfo: {
          ...prev.senderInfo,
          [field]: value
        }
      }));
    } else {
      setSelectedParcel(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleViewParcel = async (parcel) => {
    try {
      setIsLoading(true);
      const response = await getDispatchedParcelById(parcel.id);
      if (response?.success && response?.data) {
        setSelectedParcel(response.data);
        setShowViewModal(true);
      } else {
        // Fallback to basic parcel data if API call fails
        setSelectedParcel(parcel);
        setShowViewModal(true);
      }
    } catch (err) {
      console.error('Failed to load parcel details:', err);
      // Fallback to basic parcel data if API call fails
      setSelectedParcel(parcel);
      setShowViewModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock tracking history data
  const getTrackingHistory = (parcelId) => {
    return [
      {
        timestamp: '2024-03-17 14:30:00',
        status: 'Delivered',
        location: 'Customer Location',
        description: 'Package delivered to customer'
      },
      {
        timestamp: '2024-03-17 13:15:00',
        status: 'In Transit',
        location: 'Downtown Hub',
        description: 'Package out for delivery'
      },
      {
        timestamp: '2024-03-17 10:00:00',
        status: 'In Transit',
        location: 'Westside Center',
        description: 'Package arrived at sorting facility'
      },
      {
        timestamp: '2024-03-16 16:45:00',
        status: 'Pending',
        location: 'Eastside Station',
        description: 'Package received at locker'
      }
    ];
  };

  // if (isLoading) {
  //   return (
  //     <div className="dispatched-parcels-container">
  //       <div className="loading-container">
  //         <FaSpinner className="spinner" />
  //         <p>Loading parcels...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="dispatched-parcels-container">
  //       <div className="error-container">
  //         <div className="error-content">
  //           <FaTimesCircle className="error-icon" />
  //           <h2>Error Loading Parcels</h2>
  //           <p>{error}</p>
  //           <button className="retry-button" onClick={() => window.location.reload()}>
  //             <FaSpinner /> Retry
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="dispatched-parcels-container">
      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <div className="analytics-card">
          <FaBox />
          <div className="analytics-info">
            <h3>Total Today</h3>
            <p>{isLoading ? "..." : totalCount}</p>
          </div>
        </div>
      </div>

      <div className="page-header">
        <h1>Dispatched Parcels</h1>
        <div className="header-actions">
          <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter style={{ color: '#4CAF50' }} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className={`filters-section ${showFilters ? 'show' : 'hide'}`}>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Time Range</label>
              <select name="timeRange" value={filters.timeRange} onChange={handleFilterChange}>
                <option value="24h">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Date Range</label>
              <input
                type="date"
                name="dateRange"
                value={filters.dateRange}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="in transit">In Transit</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Parcel ID</label>
              <input
                type="text"
                name="parcelId"
                value={filters.parcelId}
                onChange={handleFilterChange}
                placeholder="Enter Parcel ID"
              />
            </div>
            <div className="filter-group">
              <label>Retailer</label>
              <input
                type="text"
                name="retailer"
                value={filters.retailer}
                onChange={handleFilterChange}
                placeholder="Enter Retailer Name"
              />
            </div>
            <div className="filter-group">
              <label>Customer</label>
              <input
                type="text"
                name="customer"
                value={filters.customer}
                onChange={handleFilterChange}
                placeholder="Enter Customer Name"
              />
            </div>
            <div className="filter-group">
              <label>Locker ID</label>
              <input
                type="text"
                name="lockerId"
                value={filters.lockerId}
                onChange={handleFilterChange}
                placeholder="Enter Locker ID"
              />
            </div>
            <div className="filter-group">
              <label>Size</label>
              <select name="size" value={filters.size} onChange={handleFilterChange}>
                <option value="">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Priority</label>
              <select name="priority" value={filters.priority} onChange={handleFilterChange}>
                <option value="">All Priorities</option>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="filter-actions">
            <button className="reset-button" onClick={handleResetFilters}>
              Reset Filters
            </button>
            <button className="apply-button" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedParcel && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <div className="header-content">
                <div className="header-icon">
                  <FaEdit />
                </div>
                <h2>Edit Parcel</h2>
              </div>
              <button className="close-button" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="form-grid">
                {/* Parcel Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon-wrapper">
                      <FaBox className="section-icon" />
                    </div>
                    <h3>Parcel Information</h3>
                  </div>
                  <div className="form-group">
                    <label>
                      <FaBarcode className="input-icon" />
                      Parcel ID
                    </label>
                    <input
                      type="text"
                      name="parcelId"
                      value={selectedParcel.parcelId || ''}
                      disabled
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FaClipboardCheck className="input-icon" />
                      Parcel Name
                    </label>
                    <input
                      type="text"
                      name="parcelName"
                      value={selectedParcel.parcelName || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter parcel name"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FaWeightHanging className="input-icon" />
                      Weight
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={selectedParcel.weight || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter weight"
                      step="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FaClipboardCheck className="input-icon" />
                      Status
                    </label>
                    <select
                      name="status"
                      value={selectedParcel.status || 'pending'}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="pending">Pending</option>
                      <option value="in transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Sender Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon-wrapper">
                      <FaUserFriends className="section-icon" />
                    </div>
                    <h3>Sender Information</h3>
                  </div>
                  <div className="form-group">
                    <label>
                      <FaUserCircle className="input-icon" />
                      Sender Name
                    </label>
                    <input
                      type="text"
                      name="senderName"
                      value={selectedParcel.senderName || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter sender name"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FaStore className="input-icon" />
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="senderInfo.businessName"
                      value={selectedParcel.senderInfo?.businessName || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter business name"
                    />
                  </div>
                                     <div className="form-group">
                     <label>
                       <FaIdCard className="input-icon" />
                       Phone Number
                     </label>
                     <input
                       type="tel"
                       name="senderInfo.phoneNumber"
                       value={selectedParcel.senderInfo?.phoneNumber || ''}
                       onChange={handleInputChange}
                       className="form-control"
                       placeholder="Enter phone number"
                     />
                   </div>
                </div>

                {/* Recipient Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon-wrapper">
                      <FaUser className="section-icon" />
                    </div>
                    <h3>Recipient Information</h3>
                  </div>
                  <div className="form-group">
                    <label>
                      <FaUserCircle className="input-icon" />
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      name="recipientName"
                      value={selectedParcel.recipientName || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter recipient name"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FaIdCard className="input-icon" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="recipientPhone"
                      value={selectedParcel.recipientPhone || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter recipient phone"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FaUser className="input-icon" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="recipientEmail"
                      value={selectedParcel.recipientEmail || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter recipient email"
                    />
                  </div>
                </div>

                {/* Location Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon-wrapper">
                      <FaWarehouse className="section-icon" />
                    </div>
                    <h3>Location Information</h3>
                  </div>
                  <div className="form-group">
                    <label>
                      <FaLocationArrow className="input-icon" />
                      From
                    </label>
                    <input
                      type="text"
                      name="from"
                      value={selectedParcel.from || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter source location"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FaLocationArrow className="input-icon" />
                      To
                    </label>
                    <input
                      type="text"
                      name="to"
                      value={selectedParcel.to || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter destination location"
                    />
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Parcel Modal */}
      {showViewModal && selectedParcel && (
        <div className="modal-overlay">
          <div className="view-modal">
            <div className="modal-header">
              <div className="header-content">
                <div className="header-icon">
                  <FaBox />
                </div>
                <h2>Parcel Details</h2>
              </div>
              <button className="close-button" onClick={() => setShowViewModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-content">
              <div className="info-sections">
                {/* Parcel Information Section */}
                <div className="info-section">
                  <div className="section-header">
                    <div className="section-icon-wrapper">
                      <FaBox className="section-icon" />
                    </div>
                    <h3>Parcel Information</h3>
                  </div>
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label">
                        <FaBarcode className="info-icon" />
                        <span>Parcel ID</span>
                      </div>
                      <div className="info-value">{selectedParcel.parcelId || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <FaClipboardCheck className="info-icon" />
                        <span>Parcel Name</span>
                      </div>
                      <div className="info-value">{selectedParcel.parcelName || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <FaWeightHanging className="info-icon" />
                        <span>Weight</span>
                      </div>
                      <div className="info-value">{selectedParcel.weight ? `${selectedParcel.weight}kg` : 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <FaClipboardCheck className="info-icon" />
                        <span>Status</span>
                      </div>
                      <div className="info-value">
                        <span 
                          className="status-badge"
                          style={{ 
                            backgroundColor: getStatusColor(selectedParcel.status),
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {selectedParcel.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sender Information Section */}
                <div className="info-section contact-section">
                  <div className="section-header">
                    <div className="section-icon-wrapper">
                      <FaUserFriends className="section-icon" />
                    </div>
                    <h3>Sender Information</h3>
                  </div>
                  <div className="contact-details">
                    <div className="detail-row">
                      <div className="detail-label">
                        <FaUserCircle className="detail-icon" />
                        <span>Name</span>
                      </div>
                      <div className="detail-value">{selectedParcel.senderName || 'N/A'}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">
                        <FaStore className="detail-icon" />
                        <span>Business</span>
                      </div>
                      <div className="detail-value">{selectedParcel.senderInfo?.businessName || 'N/A'}</div>
                    </div>
                                         <div className="detail-row">
                       <div className="detail-label">
                         <FaIdCard className="detail-icon" />
                         <span>Phone</span>
                       </div>
                       <div className="detail-value">{selectedParcel.senderInfo?.phoneNumber || 'N/A'}</div>
                     </div>
                  </div>
                </div>

                {/* Recipient Information Section */}
                <div className="info-section contact-section">
                  <div className="section-header">
                    <div className="section-icon-wrapper">
                      <FaUser className="section-icon" />
                    </div>
                    <h3>Recipient Information</h3>
                  </div>
                  <div className="contact-details">
                    <div className="detail-row">
                      <div className="detail-label">
                        <FaUserCircle className="detail-icon" />
                        <span>Name</span>
                      </div>
                      <div className="detail-value">{selectedParcel.recipientName || 'N/A'}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">
                        <FaUser className="detail-icon" />
                        <span>Email</span>
                      </div>
                      <div className="detail-value">{selectedParcel.recipientEmail || 'N/A'}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">
                        <FaIdCard className="detail-icon" />
                        <span>Phone</span>
                      </div>
                      <div className="detail-value">{selectedParcel.recipientPhone || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Location Information Section */}
                <div className="info-section">
                  <div className="section-header">
                    <div className="section-icon-wrapper">
                      <FaWarehouse className="section-icon" />
                    </div>
                    <h3>Location Information</h3>
                  </div>
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label">
                        <FaLocationArrow className="info-icon" />
                        <span>From</span>
                      </div>
                      <div className="info-value">{selectedParcel.from || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <FaLocationArrow className="info-icon" />
                        <span>To</span>
                      </div>
                      <div className="info-value">{selectedParcel.to || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Timeline Information Section */}
                <div className="info-section">
                  <div className="section-header">
                    <div className="section-icon-wrapper">
                      <FaCalendarAlt className="section-icon" />
                    </div>
                    <h3>Timeline Information</h3>
                  </div>
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label">
                        <FaCalendarAlt className="info-icon" />
                        <span>Created Date</span>
                      </div>
                      <div className="info-value">
                        {selectedParcel.createdAt ? new Date(selectedParcel.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <FaHistory className="info-icon" />
                        <span>Last Updated</span>
                      </div>
                      <div className="info-value">
                        {selectedParcel.updatedAt ? new Date(selectedParcel.updatedAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="close-button" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <>
        <Loading />
        </>
      ) : (
        <>

      {/* View Content */}
      <div className="view-content">
        <div className="table-container">
          {parcels.length === 0 ? (
            <div className="no-data-container">
              <p className="error-message">Failed to Load the Dispatched Parcels Data. Please try again later.</p>
              <button 
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <table className="parcels-table">
              <thead>
                <tr>
                  <th>Parcel ID</th>
                  <th>Parcel Name</th>
                  <th>Sender</th>
                  <th>Recipient</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Weight</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(getFilteredParcels() || []).map((parcel) => (
                  <tr key={parcel.id} className="clickable-row">
                    <td>{parcel.parcelId}</td>
                    <td>{parcel.parcelName}</td>
                    <td>{parcel.senderName || parcel.from || 'N/A'}</td>
                    <td>{parcel.recipientName || parcel.to || 'N/A'}</td>
                    <td>{parcel.from}</td>
                    <td>{parcel.to}</td>
                    <td>{parcel.weight}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getStatusColor(parcel.status),
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {parcel.status}
                      </span>
                    </td>
                    <td>{parcel.date}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="view-button" onClick={() => handleViewParcel(parcel)}>View</button>
                        <button className="edit-button" onClick={() => handleEditParcel(parcel)}>Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default DispatchedParcels; 