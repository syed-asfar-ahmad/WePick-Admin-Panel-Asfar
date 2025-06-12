import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaTimes, FaMapMarkerAlt, FaUser, FaStore, FaHistory, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './DispatchedParcels.scss';
import Loading from '../../../components/common/Loading';
import { getParcelReport, dispatchParcel, trackParcel, getParcelDetail } from '../../../services/wepickApi';

const DispatchedParcels = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parcels, setParcels] = useState([]);
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

  // useEffect(() => {
  //   const fetchParcels = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await getParcelReport();
  //       if (response?.data) {
  //         setParcels(response.data);
  //       }
  //       setIsLoading(false);
  //     } catch (err) {
  //       setError('Failed to load parcels. Please try again.');
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchParcels();
  // }, []);

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

  useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }, []);

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
    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    if (!hasActiveFilters) {
      return parcels;
    }

    return parcels.filter(parcel => {
      if (filters.parcelId && !parcel.id.toLowerCase().includes(filters.parcelId.toLowerCase())) {
        return false;
      }
      if (filters.retailer && !parcel.retailer.toLowerCase().includes(filters.retailer.toLowerCase())) {
        return false;
      }
      if (filters.customer && !parcel.customer.toLowerCase().includes(filters.customer.toLowerCase())) {
        return false;
      }
      if (filters.lockerId && !parcel.lockerId.toLowerCase().includes(filters.lockerId.toLowerCase())) {
        return false;
      }

      // Exact match filters
      if (filters.status && parcel.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
      if (filters.size && parcel.size.toLowerCase() !== filters.size.toLowerCase()) {
        return false;
      }
      if (filters.priority && parcel.priority.toLowerCase() !== filters.priority.toLowerCase()) {
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

  const handleEditParcel = (parcel) => {
    setSelectedParcel(parcel);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await dispatchParcel(selectedParcel);
      if (response?.data) {
        // Update the parcels list with the new data
        setParcels(prevParcels => 
          prevParcels.map(parcel => 
            parcel.id === selectedParcel.id ? response.data : parcel
          )
        );
      }
      setShowEditModal(false);
      setSelectedParcel(null);
    } catch (err) {
      setError('Failed to update parcel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedParcel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewParcel = async (parcel) => {
    try {
      setIsLoading(true);
      // Get parcel details and tracking information
      const [detailResponse, trackingResponse] = await Promise.all([
        getParcelDetail(parcel.id),
        trackParcel(parcel.trackingNumber)
      ]);

      if (detailResponse?.data && trackingResponse?.data) {
        // Combine parcel details with tracking information
        const parcelWithTracking = {
          ...detailResponse.data,
          tracking: trackingResponse.data
        };
        setSelectedParcel(parcelWithTracking);
        navigate(`/viewdispatchedparcels/${parcel.id}`);
      }
    } catch (err) {
      setError('Failed to load parcel details. Please try again later.');
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
            <p>{isLoading ? "..." : (parcels.length > 0 ? analytics.totalToday : 0)}</p>
          </div>
        </div>
        <div className="analytics-card">
          <FaClock />
          <div className="analytics-info">
            <h3>Avg. Delivery Time</h3>
            <p>{isLoading ? "..." : (parcels.length > 0 ? analytics.avgDeliveryTime : "0 hours")}</p>
          </div>
        </div>
        <div className="analytics-card">
          <FaTruck />
          <div className="analytics-info">
            <h3>In Transit</h3>
            <p>{isLoading ? "..." : (parcels.length > 0 ? analytics.statusBreakdown.inTransit : 0)}</p>
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
              <h2>Edit Parcel</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Parcel ID</label>
                  <input
                    type="text"
                    name="id"
                    value={selectedParcel.id}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Tracking Number</label>
                  <input
                    type="text"
                    name="trackingNumber"
                    value={selectedParcel.trackingNumber}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Retailer</label>
                  <input
                    type="text"
                    name="retailer"
                    value={selectedParcel.retailer}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Customer</label>
                  <input
                    type="text"
                    name="customer"
                    value={selectedParcel.customer}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={selectedParcel.status}
                    onChange={handleInputChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Locker ID</label>
                  <select
                    name="lockerId"
                    value={selectedParcel.lockerId}
                    onChange={handleInputChange}
                  >
                    {lockerLocations.map(locker => (
                      <option key={locker.id} value={locker.id}>
                        {locker.name} ({locker.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Size</label>
                  <select
                    name="size"
                    value={selectedParcel.size}
                    onChange={handleInputChange}
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={selectedParcel.priority}
                    onChange={handleInputChange}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Express">Express</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
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
                  <th>Retailer</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Locker ID</th>
                  <th>Size</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredParcels().map((parcel) => (
                  <tr key={parcel.id} className="clickable-row">
                    <td>{parcel.id}</td>
                    <td>{parcel.retailer}</td>
                    <td>{parcel.customer}</td>
                    <td>{parcel.date}</td>
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
                    <td>{parcel.lockerId}</td>
                    <td>{parcel.size}</td>
                    <td>{parcel.priority}</td>
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