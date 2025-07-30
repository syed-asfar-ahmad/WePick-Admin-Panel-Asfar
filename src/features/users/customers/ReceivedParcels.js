import React, { useState, useEffect } from 'react';
import {  FaFilter, FaBox, FaTruck,  FaClock, FaTimes, FaUser, FaMapMarkerAlt, FaWeight, FaCalendarAlt, FaIdCard, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ReceivedParcels.scss';
import Loading from '../../../components/common/Loading';
import { getReceivedParcels, updateReceivedParcelById } from '../../../services/wepickApi';
import { CustomToast } from '../../../atoms/toastMessage';


const ReceivedParcels = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [error, setError] = useState(null);
  const [totalParcelCount, setTotalParcelCount] = useState(0);
  const [filters, setFilters] = useState({
    dateRange: '',
    parcelId: '',
    senderName: '',
    recipientName: '',
    from: '',
    to: '',
    weight: '',
    timeRange: '24h'
  });

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalParcels: 0
  });

  // Fetch received parcels from API
  const fetchReceivedParcels = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getReceivedParcels();
      
      const { success, message, data } = response;
      
      if (success) {
        setParcels(data.parcels || []);
        setFilteredParcels(data.parcels || []);
        setTotalParcelCount(data.totalParcelCount || 0);
        
        // Update analytics with total parcels count
        setAnalytics({
          totalParcels: data.totalParcelCount || 0
        });
      } else {
        setError(message || 'Failed to fetch received parcels');
        CustomToast({
          type: "error",
          message: message || 'Failed to fetch received parcels'
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to fetch received parcels');
      CustomToast({
        type: "error",
        message: error.response?.data?.message || error.message || 'Failed to fetch received parcels'
      });
    } finally {
      setIsLoading(false);
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

  // Fetch data when component mounts
  useEffect(() => {
    fetchReceivedParcels();
  }, []);


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

  // Apply filters whenever filters state changes or parcels change
  useEffect(() => {
    applyFilters();
  }, [filters, parcels]);

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
      parcelId: '',
      senderName: '',
      recipientName: '',
      from: '',
      to: '',
      weight: '',
      timeRange: '24h'
    });
    setFilteredParcels(parcels);
  };

  const applyFilters = () => {
    if (!parcels || parcels.length === 0) {
      setFilteredParcels([]);
      return;
    }
    
    let result = [...parcels];
    
    // Apply parcel ID filter
    if (filters.parcelId) {
      result = result.filter(parcel => 
        parcel.parcelId && parcel.parcelId.toLowerCase().includes(filters.parcelId.toLowerCase())
      );
    }
    
    // Apply sender name filter
    if (filters.senderName) {
      result = result.filter(parcel => 
        parcel.senderName && parcel.senderName.toLowerCase().includes(filters.senderName.toLowerCase())
      );
    }
    
    // Apply recipient name filter
    if (filters.recipientName) {
      result = result.filter(parcel => 
        parcel.recipientName && parcel.recipientName.toLowerCase().includes(filters.recipientName.toLowerCase())
      );
    }
    
    // Apply from location filter
    if (filters.from) {
      result = result.filter(parcel => 
        parcel.from && parcel.from.toLowerCase().includes(filters.from.toLowerCase())
      );
    }
    
    // Apply to location filter
    if (filters.to) {
      result = result.filter(parcel => 
        parcel.to && parcel.to.toLowerCase().includes(filters.to.toLowerCase())
      );
    }
    
    // Apply weight filter
    if (filters.weight) {
      const weightValue = parseFloat(filters.weight);
      if (!isNaN(weightValue)) {
        result = result.filter(parcel => 
          parcel.weight === weightValue
        );
      }
    }
    
    // Apply date range filter
    if (filters.dateRange) {
      result = result.filter(parcel => 
        parcel.Date === filters.dateRange || 
        (parcel.createdAt && new Date(parcel.createdAt).toISOString().split('T')[0] === filters.dateRange)
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

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!selectedParcel.parcelName?.trim()) {
        CustomToast({
          type: "error",
          message: "Parcel Name is required"
        });
        return;
      }
      
      if (!selectedParcel.senderName?.trim()) {
        CustomToast({
          type: "error",
          message: "Sender Name is required"
        });
        return;
      }
      
      if (!selectedParcel.recipientName?.trim()) {
        CustomToast({
          type: "error",
          message: "Recipient Name is required"
        });
        return;
      }
      
      if (!selectedParcel.from?.trim()) {
        CustomToast({
          type: "error",
          message: "From location is required"
        });
        return;
      }
      
      if (!selectedParcel.to?.trim()) {
        CustomToast({
          type: "error",
          message: "To location is required"
        });
        return;
      }
      
      // Validate weight
      if (selectedParcel.weight && (isNaN(selectedParcel.weight) || selectedParcel.weight <= 0)) {
        CustomToast({
          type: "error",
          message: "Weight must be a positive number"
        });
        return;
      }
      
      // Make API call to update the parcel
      const response = await updateReceivedParcelById(selectedParcel.id, selectedParcel);
      
      const { success, message } = response;
      
      if (success) {
        // Update the parcel in the local state
        const updatedParcels = parcels.map(p => 
          p.id === selectedParcel.id ? selectedParcel : p
        );
        
        setParcels(updatedParcels);
        setFilteredParcels(
          filteredParcels.map(p => p.id === selectedParcel.id ? selectedParcel : p)
        );
        
        CustomToast({
          type: "success",
          message: message || "Parcel updated successfully"
        });
        
        // Close modal after successful update
        setShowEditModal(false);
        setSelectedParcel(null);
      } else {
        CustomToast({
          type: "error",
          message: message || "Failed to update parcel"
        });
      }
    } catch (error) {
      console.error('❌ Update error:', error);
      CustomToast({
        type: "error",
        message: error.response?.data?.message || error.message || "Failed to update parcel"
      });
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
             <h3>Total Parcels</h3>
             <p>{isLoading ? "..." : analytics.totalParcels}</p>
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
              <label>Date</label>
              <input
                type="date"
                name="dateRange"
                value={filters.dateRange}
                onChange={handleFilterChange}
              />
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
              <label>Sender Name</label>
              <input
                type="text"
                name="senderName"
                value={filters.senderName}
                onChange={handleFilterChange}
                placeholder="Enter Sender Name"
              />
            </div>
            <div className="filter-group">
              <label>Recipient Name</label>
              <input
                type="text"
                name="recipientName"
                value={filters.recipientName}
                onChange={handleFilterChange}
                placeholder="Enter Recipient Name"
              />
            </div>
            <div className="filter-group">
              <label>From</label>
              <input
                type="text"
                name="from"
                value={filters.from}
                onChange={handleFilterChange}
                placeholder="From Location"
              />
            </div>
            <div className="filter-group">
              <label>To</label>
              <input
                type="text"
                name="to"
                value={filters.to}
                onChange={handleFilterChange}
                placeholder="To Location"
              />
            </div>
            <div className="filter-group">
              <label>Weight</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={filters.weight}
                onChange={handleFilterChange}
                placeholder="Enter Weight"
              />
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
              <div className="modal-content">
                 
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
                       <FaIdCard className="input-icon" />
                       Parcel ID
                     </label>
                     <input
                       type="text"
                       name="parcelId"
                       value={selectedParcel.parcelId || selectedParcel.id || ''}
                       onChange={handleInputChange}
                       disabled
                       className="disabled-field"
                     />
                   </div>
                   <div className="form-group">
                     <label>
                       <FaBox className="input-icon" />
                       Parcel Name
                     </label>
                     <input
                       type="text"
                       name="parcelName"
                       value={selectedParcel.parcelName || ''}
                       onChange={handleInputChange}
                       placeholder="Enter parcel name"
                       required
                     />
                   </div>
                   <div className="form-group">
                     <label>
                       <FaWeight className="input-icon" />
                       Weight (kg)
                     </label>
                     <input
                       type="number"
                       step="0.1"
                       min="0"
                       name="weight"
                       value={selectedParcel.weight || ''}
                       onChange={handleInputChange}
                       placeholder="Enter weight in kg"
                     />
                   </div>
                 </div>

                 {/* Sender & Recipient Information Section */}
                 <div className="form-section">
                   <div className="section-header">
                     <div className="section-icon-wrapper">
                       <FaUser className="section-icon" />
                     </div>
                     <h3>Sender & Recipient Information</h3>
                   </div>
                   <div className="form-group">
                     <label>
                       <FaUser className="input-icon" />
                       Sender Name
                     </label>
                     <input
                       type="text"
                       name="senderName"
                       value={selectedParcel.senderName || ''}
                       onChange={handleInputChange}
                       placeholder="Enter sender name"
                       required
                     />
                   </div>
                   <div className="form-group">
                     <label>
                       <FaUser className="input-icon" />
                       Recipient Name
                     </label>
                     <input
                       type="text"
                       name="recipientName"
                       value={selectedParcel.recipientName || ''}
                       onChange={handleInputChange}
                       placeholder="Enter recipient name"
                       required
                     />
                   </div>
                 </div>

                 {/* Location Information Section */}
                 <div className="form-section">
                   <div className="section-header">
                     <div className="section-icon-wrapper">
                       <FaMapMarkerAlt className="section-icon" />
                     </div>
                     <h3>Location Information</h3>
                   </div>
                   <div className="form-group">
                     <label>
                       <FaMapMarkerAlt className="input-icon" />
                       From Location
                     </label>
                     <input
                       type="text"
                       name="from"
                       value={selectedParcel.from || ''}
                       onChange={handleInputChange}
                       placeholder="Enter source location"
                       required
                     />
                   </div>
                   <div className="form-group">
                     <label>
                       <FaMapMarkerAlt className="input-icon" />
                       To Location
                     </label>
                     <input
                       type="text"
                       name="to"
                       value={selectedParcel.to || ''}
                       onChange={handleInputChange}
                       placeholder="Enter destination location"
                       required
                     />
                   </div>
                 </div>

                 {/* Timestamps Section */}
                 <div className="form-section">
                   <div className="section-header">
                     <div className="section-icon-wrapper">
                       <FaHistory className="section-icon" />
                     </div>
                     <h3>Timestamps</h3>
                   </div>
                   <div className="form-group">
                     <label>
                       <FaCalendarAlt className="input-icon" />
                       Date
                     </label>
                     <input
                       type="text"
                       value={selectedParcel.Date || new Date(selectedParcel.createdAt).toLocaleDateString() || 'N/A'}
                       disabled
                       className="disabled-field"
                     />
                   </div>
                   <div className="form-group">
                     <label>
                       <FaClock className="input-icon" />
                       Created At
                     </label>
                     <input
                       type="text"
                       value={selectedParcel.createdAt ? new Date(selectedParcel.createdAt).toLocaleString() : 'N/A'}
                       disabled
                       className="disabled-field"
                     />
                   </div>
                   <div className="form-group">
                     <label>
                       <FaClock className="input-icon" />
                       Updated At
                     </label>
                     <input
                       type="text"
                       value={selectedParcel.updatedAt ? new Date(selectedParcel.updatedAt).toLocaleString() : 'N/A'}
                       disabled
                       className="disabled-field"
                     />
                   </div>
                 </div>
               </div>
               <div className="modal-actions">
                 <button type="button" className="cancel-button" onClick={() => {
                   setShowEditModal(false);
                   setSelectedParcel(null);
                 }}>
                   Cancel
                 </button>
                 <button type="submit" className="save-button" disabled={isLoading}>
                   {isLoading ? 'Saving...' : 'Save Changes'}
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
          <table className="parcels-table">
            <thead>
              <tr>
                <th>Parcel ID</th>
                <th>Parcel Name</th>
                <th>Sender Name</th>
                <th>Recipient Name</th>
                <th>From</th>
                <th>To</th>
                <th>Weight</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParcels.length > 0 ? (
                filteredParcels.map((parcel) => (
                  <tr key={parcel.id} className="clickable-row">
                    <td>{parcel.parcelId || parcel.id}</td>
                    <td>{parcel.parcelName || 'N/A'}</td>
                    <td>{parcel.senderName || 'N/A'}</td>
                    <td>{parcel.recipientName || 'N/A'}</td>
                    <td>{parcel.from || 'N/A'}</td>
                    <td>{parcel.to || 'N/A'}</td>
                    <td>{parcel.weight || 'N/A'}</td>
                    <td>{parcel.Date || new Date(parcel.createdAt).toLocaleDateString() || 'N/A'}</td>
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
      </>
      )}
    </div>
  );
};

export default ReceivedParcels;