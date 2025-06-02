import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaTimes, FaMapMarkerAlt, FaUser, FaStore, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ReceivedParcels.scss';

const ReceivedParcels = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: '',
    status: '',
    parcelId: '',
    retailer: '',
    customer: '',
    lockerId: '',
    size: '',
    priority: '',
    timeRange: '24h'
  });

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

  // Mock data - In real application, this would come from an API
  const parcels = [
    {
      id: 'P12345',
      retailer: 'Tech Gadgets Store',
      customer: 'John Doe',
      date: '2024-03-15',
      status: 'In Transit',
      lockerId: 'L789',
      size: 'Medium',
      priority: 'Standard',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'P12346',
      retailer: 'Fashion Boutique',
      customer: 'Jane Smith',
      date: '2024-03-14',
      status: 'Delivered',
      lockerId: 'L456',
      size: 'Large',
      priority: 'Express',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'P12347',
      retailer: 'Home Essentials',
      customer: 'Mike Wilson',
      date: '2024-03-16',
      status: 'Pending',
      lockerId: 'L234',
      size: 'Small',
      priority: 'Standard',
      trackingNumber: 'TRK456789123'
    },
    {
      id: 'P12348',
      retailer: 'Gourmet Delights',
      customer: 'Sarah Brown',
      date: '2024-03-15',
      status: 'In Transit',
      lockerId: 'L567',
      size: 'Medium',
      priority: 'Express',
      trackingNumber: 'TRK789123456'
    },
    {
      id: 'P12349',
      retailer: 'Sports & Fitness',
      customer: 'David Lee',
      date: '2024-03-17',
      status: 'Pending',
      lockerId: 'L890',
      size: 'Large',
      priority: 'Urgent',
      trackingNumber: 'TRK321654987'
    },
    {
      id: 'P12350',
      retailer: 'Tech Gadgets Store',
      customer: 'Emily Chen',
      date: '2024-03-16',
      status: 'Delivered',
      lockerId: 'L123',
      size: 'Small',
      priority: 'Standard',
      trackingNumber: 'TRK147258369'
    },
    {
      id: 'P12351',
      retailer: 'Fashion Boutique',
      customer: 'Robert Taylor',
      date: '2024-03-17',
      status: 'Failed',
      lockerId: 'L345',
      size: 'Medium',
      priority: 'Express',
      trackingNumber: 'TRK963852741'
    },
    {
      id: 'P12352',
      retailer: 'Home Essentials',
      customer: 'Lisa Anderson',
      date: '2024-03-15',
      status: 'In Transit',
      lockerId: 'L678',
      size: 'Large',
      priority: 'Standard',
      trackingNumber: 'TRK852963741'
    }
  ];

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

  // Apply filters whenever filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters]);

  // Initialize filtered parcels with all parcels
  useEffect(() => {
    setFilteredParcels(parcels);
  }, []);

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
      timeRange: '24h'
    });
    setFilteredParcels(parcels);
  };

  const applyFilters = () => {
    let result = [...parcels];
    
    // Apply parcel ID filter
    if (filters.parcelId) {
      result = result.filter(parcel => 
        parcel.id.toLowerCase().includes(filters.parcelId.toLowerCase())
      );
    }
    
    // Apply retailer filter
    if (filters.retailer) {
      result = result.filter(parcel => 
        parcel.retailer.toLowerCase().includes(filters.retailer.toLowerCase())
      );
    }
    
    // Apply customer filter
    if (filters.customer) {
      result = result.filter(parcel => 
        parcel.customer.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }
    
    // Apply locker ID filter
    if (filters.lockerId) {
      result = result.filter(parcel => 
        parcel.lockerId.toLowerCase().includes(filters.lockerId.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(parcel => 
        parcel.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    // Apply size filter
    if (filters.size) {
      result = result.filter(parcel => 
        parcel.size.toLowerCase() === filters.size.toLowerCase()
      );
    }
    
    // Apply priority filter
    if (filters.priority) {
      result = result.filter(parcel => 
        parcel.priority.toLowerCase() === filters.priority.toLowerCase()
      );
    }
    
    // Apply date range filter
    if (filters.dateRange) {
      result = result.filter(parcel => 
        parcel.date === filters.dateRange
      );
    }
    
    setFilteredParcels(result);
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

  const handleSaveEdit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the parcel
    console.log('Saving changes for parcel:', selectedParcel);
    
    // Update the parcel in the local state
    const updatedParcels = parcels.map(p => 
      p.id === selectedParcel.id ? selectedParcel : p
    );
    setFilteredParcels(updatedParcels);
    
    setShowEditModal(false);
    setSelectedParcel(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedParcel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleViewParcel = (parcel) => {
  //   navigate(`/receivedparcels/${parcel.id}`);
  // };

  const handleViewParcel = (parcel) => {
    navigate(`/receivedparcels/${parcel.id}`, { state: { parcel } });
  };

  return (
    <div className="dispatched-parcels-container">
      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <div className="analytics-card">
          <FaBox />
          <div className="analytics-info">
            <h3>Total Today</h3>
            <p>{analytics.totalToday}</p>
          </div>
        </div>
        <div className="analytics-card">
          <FaClock />
          <div className="analytics-info">
            <h3>Avg. Delivery Time</h3>
            <p>{analytics.avgDeliveryTime}</p>
          </div>
        </div>
        <div className="analytics-card">
          <FaTruck />
          <div className="analytics-info">
            <h3>In Transit</h3>
            <p>{analytics.statusBreakdown.inTransit}</p>
          </div>
        </div>
      </div>

      <div className="page-header">
        <h1>Received Parcels</h1>
        <div className="header-actions">
          <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter style={{ color: '#4CAF50' }} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      {showFilters && (
        <div className="filters-section">
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
            <button className="apply-button" onClick={applyFilters}>
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

      {/* View Content */}
      <div className="view-content">
        <div className="table-container">
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
              {filteredParcels.length > 0 ? (
                filteredParcels.map((parcel) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-results">
                    No parcels found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceivedParcels;