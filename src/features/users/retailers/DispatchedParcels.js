import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaTimes, FaClock, FaMapMarkerAlt, FaUser, FaStore, FaHistory, FaSpinner, FaExclamationTriangle, FaBarcode, FaClipboardCheck, FaWeightHanging, FaUserFriends, FaUserCircle, FaIdCard, FaWarehouse, FaLocationArrow, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './DispatchedParcels.scss';
import Loading from '../../../components/common/Loading';
import { getDispatchedParcels, getDispatchedParcelById, updateDispatchedParcelById } from '../../../services/wepickApi';
import { CustomToast } from '../../../atoms/toastMessage';

const DispatchedParcels = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [originalParcelData, setOriginalParcelData] = useState(null);
  const [hasFormChanges, setHasFormChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [updatesSupported, setUpdatesSupported] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [senderNameError, setSenderNameError] = useState('');
  const [recipientNameError, setRecipientNameError] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(20);
  
  const [filters, setFilters] = useState({
    dateRange: ''
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

  // Fetch dispatched parcels with search and date filter functionality
  const fetchParcelsWithSearch = async (page = 1, searchQuery = '', dateFilter = '') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getDispatchedParcels(page, searchQuery, dateFilter);
      
      if (response?.success) {
        const parcelsData = response.data?.parcels || response.data?.data || response.data || [];
        const totalParcelsFromAPI = response.data?.totalCount || response.data?.totalParcels || 0;
        const totalPagesFromAPI = response.data?.totalPages || 1;
        
        
        setParcels(parcelsData);
        setTotalCount(totalParcelsFromAPI);
        setTotalPages(totalPagesFromAPI);
        setCurrentPage(response.data?.currentPage || page);
      } else {
        setError('Failed to load dispatched parcels. Please try again.');
        setParcels([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('fetchParcelsWithSearch error:', err);
      setError('Failed to load dispatched parcels. Please try again.');
      setParcels([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };


  // Fetch parcels for specific page
  const fetchParcelsForPage = async (page) => {
    fetchParcelsWithSearch(page, searchTerm, filters.dateRange);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchParcelsForPage(page);
  };

  // Calculate today's parcels count
  const getTodayParcelsCount = () => {
    if (!Array.isArray(parcels)) return 0;
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return parcels.filter(parcel => {
      // Check if parcel has a date field
      if (parcel.date) {
        const parcelDate = new Date(parcel.date);
        const parcelDateString = parcelDate.toISOString().split('T')[0];
        return parcelDateString === todayString;
      }
      
      // Check if parcel has createdAt field
      if (parcel.createdAt) {
        const parcelDate = new Date(parcel.createdAt);
        const parcelDateString = parcelDate.toISOString().split('T')[0];
        return parcelDateString === todayString;
      }
      
      return false;
    }).length;
  };

  useEffect(() => {
    fetchParcelsWithSearch(1, '');
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset search and pagination
  const resetSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchParcelsWithSearch(1, '', filters.dateRange); // Fetch all parcels without search but keep date filter
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: ''
    });
    setCurrentPage(1);
    fetchParcelsWithSearch(1, searchTerm, ''); // Fetch all parcels without date filter
  };




  
  // Use parcels directly since API handles search and pagination
  const paginatedParcels = parcels;

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered':
        return '#4cb050';
      case 'in transit':
        return '#2196f3';
      case 'pending':
        return '#ff9700';
      case 'failed':
        return '#F44336';
      case 'deposit':
        return '#2196f3';
      case 'pickup':
        return '#8bc24a';
      default:
        return '#757575';
    }
  };

  const handleEditParcel = async (parcel) => {
    try {
      const response = await getDispatchedParcelById(parcel.id);
      if (response?.success && response?.data) {
        setSelectedParcel(response.data);
        setOriginalParcelData(response.data);
      } else {
        // Fallback to basic parcel data if API call fails
        setSelectedParcel(parcel);
        setOriginalParcelData(parcel);
      }
      setShowEditModal(true);
    } catch (err) {
      // Fallback to basic parcel data if API call fails
      setSelectedParcel(parcel);
      setOriginalParcelData(parcel);
      setShowEditModal(true);
    }
    // Reset change tracking
    setHasFormChanges(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    // Check if there are any name validation errors
    if (senderNameError || recipientNameError) {
      CustomToast({
        type: "error",
        message: "Please fix the name fields before saving"
      });
      return;
    }
    
    try {
      setIsEditLoading(true);
      
      // Create a clean update data object with only non-empty values
      const updateData = {};
      
      // Parcel Information
      if (selectedParcel.parcelName) updateData.parcelName = selectedParcel.parcelName;
      if (selectedParcel.weight) updateData.weight = selectedParcel.weight;
      if (selectedParcel.status) updateData.status = selectedParcel.status;
      
      // Sender Information
      if (selectedParcel.senderName) updateData.senderName = selectedParcel.senderName;
      // Note: businessName and phoneNumber are disabled/read-only fields, so they won't be updated
      
      // Recipient Information
      if (selectedParcel.recipientName) updateData.recipientName = selectedParcel.recipientName;
      if (selectedParcel.recipientEmail) updateData.recipientEmail = selectedParcel.recipientEmail;
      if (selectedParcel.recipientPhone) updateData.recipientPhone = selectedParcel.recipientPhone;
      
      // Location Information
      if (selectedParcel.from) updateData.from = selectedParcel.from;
      if (selectedParcel.to) updateData.to = selectedParcel.to;
      
      const response = await updateDispatchedParcelById(selectedParcel.id, updateData);
      
      if (response?.success) {
        CustomToast({
          type: "success",
          message: response?.message || response?.data?.message || "Parcel updated successfully"
        });
        setShowEditModal(false);
        setSelectedParcel(null);
        setOriginalParcelData(null);
        setHasFormChanges(false);
        fetchParcelsWithSearch(1, searchTerm); // Refresh list after edit
      } else {
        throw new Error('Failed to update parcel');
      }
    } catch (err) {
      CustomToast({
        type: "error",
        message: err?.response?.data?.message || err?.message || 'Failed to update parcel. Please try again.'
      });
      setError('Failed to update parcel. Please try again.');
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate sender and recipient name fields
    if (name === 'senderName') {
      const alphabetOnlyRegex = /^[a-zA-Z\s'-]*$/;
      if (value && !alphabetOnlyRegex.test(value)) {
        setSenderNameError('Only alphabets allowed');
      } else {
        setSenderNameError('');
      }
    } else if (name === 'recipientName') {
      const alphabetOnlyRegex = /^[a-zA-Z\s'-]*$/;
      if (value && !alphabetOnlyRegex.test(value)) {
        setRecipientNameError('Only alphabets allowed');
      } else {
        setRecipientNameError('');
      }
    }
    
    // Handle nested senderInfo fields
    if (name.startsWith('senderInfo.')) {
      const field = name.split('.')[1];
      setSelectedParcel(prev => {
        const newParcel = {
          ...prev,
          senderInfo: {
            ...prev.senderInfo,
            [field]: value
          }
        };
        
        // Check for changes with the new parcel data
        setTimeout(() => {
          const hasChanges = checkForChangesWithNewData(newParcel);
          setHasFormChanges(hasChanges);
        }, 0);
        
        return newParcel;
      });
    } else {
      setSelectedParcel(prev => {
        const newParcel = {
          ...prev,
          [name]: value
        };
        
        // Check for changes with the new parcel data
        setTimeout(() => {
          const hasChanges = checkForChangesWithNewData(newParcel);
          setHasFormChanges(hasChanges);
        }, 0);
        
        return newParcel;
      });
    }
  };

  // Function to check if form has any changes
  const checkForChanges = () => {
    if (!originalParcelData || !selectedParcel) return false;
    
    // Helper function to safely compare values
    const isDifferent = (original, current) => {
      const orig = original || '';
      const curr = current || '';
      return orig !== curr;
    };
    
    // Check main fields (excluding read-only fields)
    if (isDifferent(originalParcelData.parcelName, selectedParcel.parcelName)) return true;
    if (isDifferent(originalParcelData.weight, selectedParcel.weight)) return true;
    if (isDifferent(originalParcelData.status, selectedParcel.status)) return true;
    if (isDifferent(originalParcelData.senderName, selectedParcel.senderName)) return true;
    if (isDifferent(originalParcelData.recipientName, selectedParcel.recipientName)) return true;
    if (isDifferent(originalParcelData.recipientEmail, selectedParcel.recipientEmail)) return true;
    if (isDifferent(originalParcelData.from, selectedParcel.from)) return true;
    if (isDifferent(originalParcelData.to, selectedParcel.to)) return true;
    
    // Note: businessName, phoneNumber, and recipientPhone are disabled/read-only fields, so they won't trigger change detection
    
    return false;
  };

  // Function to check changes with new parcel data (used during input changes)
  const checkForChangesWithNewData = (newParcelData) => {
    if (!originalParcelData || !newParcelData) return false;
    
    // Helper function to safely compare values
    const isDifferent = (original, current) => {
      const orig = original || '';
      const curr = current || '';
      return orig !== curr;
    };
    
    // Check main fields (excluding read-only fields)
    if (isDifferent(originalParcelData.parcelName, newParcelData.parcelName)) return true;
    if (isDifferent(originalParcelData.weight, newParcelData.weight)) return true;
    if (isDifferent(originalParcelData.status, newParcelData.status)) return true;
    if (isDifferent(originalParcelData.senderName, newParcelData.senderName)) return true;
    if (isDifferent(originalParcelData.recipientName, newParcelData.recipientName)) return true;
    if (isDifferent(originalParcelData.recipientEmail, newParcelData.recipientEmail)) return true;
    if (isDifferent(originalParcelData.from, newParcelData.from)) return true;
    if (isDifferent(originalParcelData.to, newParcelData.to)) return true;
    
    // Note: businessName, phoneNumber, and recipientPhone are disabled/read-only fields, so they won't trigger change detection
    
    return false;
  };

  const handleViewParcel = async (parcel) => {
    try {
      const response = await getDispatchedParcelById(parcel.id);
      if (response?.success && response?.data) {
        setSelectedParcel(response.data);
      } else {
        // Fallback to basic parcel data if API call fails
        setSelectedParcel(parcel);
      }
      setShowViewModal(true);
    } catch (err) {
      // Fallback to basic parcel data if API call fails
      setSelectedParcel(parcel);
      setShowViewModal(true);
    }
  };

  return (
    <div className="dispatched-parcels-container">
      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <div className="analytics-card">
          <FaBox />
          <div className="analytics-info">
            <h3>Total Today</h3>
            <p>{isLoading ? "..." : getTodayParcelsCount()}</p>
          </div>
        </div>
      </div>

      <div className="page-header">
        <h1>Dispatched Parcels</h1>
        <div className="header-actions">
          <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter style={{ color: '#4CAF50' }} /> {showFilters ? 'Close Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className={`filters-section ${showFilters ? 'show' : 'hide'}`}>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Date Range</label>
              <input
                type="date"
                name="dateRange"
                value={filters.dateRange}
                onChange={(e) => {
                  const dateValue = e.target.value;
                  setFilters(prev => ({
                    ...prev,
                    dateRange: dateValue
                  }));
                  setCurrentPage(1);
                  
                  // Don't search if already loading
                  if (isLoading) {
                    return;
                  }
                  
                  // Debounce search to avoid multiple API calls
                  clearTimeout(window.dateTimeout);
                  window.dateTimeout = setTimeout(() => {
                    fetchParcelsWithSearch(1, searchTerm, dateValue);
                  }, 500);
                }}
              />
            </div>
          </div>
          <div className="filter-actions">
            <button className="reset-button" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Search Filter */}
      <div className="search-filter-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search dispatched parcels"
            value={searchTerm}
            onChange={(e) => {
              const searchValue = e.target.value;
              setSearchTerm(searchValue);
              setCurrentPage(1); // Reset to first page when searching
              
              // Don't search if already loading
              if (isLoading) {
                return;
              }
              
              // Debounce search to avoid multiple API calls
              clearTimeout(window.searchTimeout);
              window.searchTimeout = setTimeout(() => {
                fetchParcelsWithSearch(1, searchValue, filters.dateRange);
              }, 1800);
            }}
            className={`search-input ${isLoading ? 'disabled' : ''}`}
            disabled={isLoading}
          />
        </div>
        {searchTerm && (
          <div className="search-results-info">
            <button 
              className="reset-search-btn"
              onClick={resetSearch}
              disabled={isLoading}
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedParcel && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <div className="header-content">
                <div className="header-icon-wrapper">
                  <FaEdit className="header-icon" />
                </div>
                <h2>Edit Parcel</h2>
              </div>
              <button className="close-button" onClick={() => setShowEditModal(false)} disabled={isEditLoading}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-content">
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
                      disabled={isEditLoading}
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
                      disabled={isEditLoading}
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
                      disabled={isEditLoading}
                    >
                      <option value="deposit">Deposit</option>
                      <option value="delivered">Delivered</option>
                      <option value="pickup">Pickup</option>
                      <option value="pending">Pending</option>
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
                      className={`form-control ${senderNameError ? 'error' : ''}`}
                      placeholder="Enter sender name"
                      disabled={isEditLoading}
                    />
                    {senderNameError && (
                      <div className="error-message" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                        {senderNameError}
                      </div>
                    )}
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
                      className="form-control"
                      placeholder="Enter business name"
                      disabled={true}
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
                      className="form-control"
                      placeholder="Enter phone number"
                      disabled={true}
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
                      className={`form-control ${recipientNameError ? 'error' : ''}`}
                      placeholder="Enter recipient name"
                      disabled={isEditLoading}
                    />
                    {recipientNameError && (
                      <div className="error-message" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                        {recipientNameError}
                      </div>
                    )}
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
                      readOnly
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
                      disabled={isEditLoading}
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
                      disabled={isEditLoading}
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
                      disabled={isEditLoading}
                    />
                  </div>
                </div>
                </div>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => {
                    // Reset form to original values
                    if (originalParcelData) {
                      setSelectedParcel(originalParcelData);
                      setHasFormChanges(false);
                    }
                  }} 
                  disabled={isEditLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="save-button" disabled={isEditLoading || !hasFormChanges}>
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
                      <div className="info-value">{selectedParcel.weight ? `${selectedParcel.weight}kg` : '-'}</div>
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
          {paginatedParcels.length === 0 ? (
            <div className="no-data-container">
              <p className="error-message">No parcels found matching your criteria.</p>
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
                {paginatedParcels.map((parcel) => (
                  <tr key={parcel.id} className="clickable-row">
                    <td>{parcel.parcelId}</td>
                    <td>{parcel.parcelName}</td>
                    <td>{parcel.senderName || parcel.from || 'N/A'}</td>
                    <td>{parcel.recipientName || parcel.to || 'N/A'}</td>
                    <td>{parcel.from}</td>
                    <td>{parcel.to}</td>
                    <td>{parcel.weight || '-'}</td>
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
                        <button className="edit-button" onClick={() => handleEditParcel(parcel)} disabled={parcel.status?.toLowerCase() === 'delivered'}>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Server-side Pagination */}
      {paginatedParcels.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            {!searchTerm && !filters.dateRange ? (
              `Showing ${((currentPage - 1) * pageSize) + 1} to ${Math.min(currentPage * pageSize, totalCount)} of ${totalCount} parcels`
            ) : null}
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
    </div>
  );
};

export default DispatchedParcels; 