import React, { useState, useEffect } from 'react';
import {  FaFilter, FaBox, FaTruck,  FaClock, FaTimes, FaUser, FaMapMarkerAlt, FaWeight, FaCalendarAlt, FaIdCard, FaHistory, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ReceivedParcels.scss';
import Loading from '../../../components/common/Loading';
import { getReceivedParcels } from '../../../services/wepickApi';
import { CustomToast } from '../../../atoms/toastMessage';


const ReceivedParcels = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [error, setError] = useState(null);
  const [totalParcelCount, setTotalParcelCount] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState({
    dateRange: '',
    parcelId: '',
    senderName: '',
    recipientName: '',
    from: '',
    to: '',
    weight: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalParcels: 0
  });

  // Fetch received parcels from API
  const fetchReceivedParcels = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getReceivedParcels(page);
      
      const { success, message, data } = response;
      
      if (success) {
        const parcelsData = data.parcels || data.data || data || [];
        
        // Update pagination from API response
        const totalParcelsFromAPI = data.totalParcelCount || data.totalCount || parcelsData.length;
        const calculatedTotalPages = Math.ceil(totalParcelsFromAPI / pageSize);
        
        setCurrentPage(data.currentPage || page);
        setTotalPages(data.totalPages || calculatedTotalPages);
        setTotalParcelCount(totalParcelsFromAPI);
        
        setParcels(parcelsData);
        setFilteredParcels(parcelsData);
        
        // Update analytics with total parcels count
        setAnalytics({
          totalParcels: totalParcelsFromAPI
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

  // Fetch parcels for specific page
  const fetchParcelsForPage = async (page) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getReceivedParcels(page);
      
      const { success, message, data } = response;
      
      if (success) {
        const parcelsData = data.parcels || data.data || data || [];
        
        // Update pagination from API response
        const totalParcelsFromAPI = data.totalParcelCount || data.totalCount || parcelsData.length;
        const calculatedTotalPages = Math.ceil(totalParcelsFromAPI / pageSize);
        
        setCurrentPage(data.currentPage || page);
        setTotalPages(data.totalPages || calculatedTotalPages);
        setTotalParcelCount(totalParcelsFromAPI);
        
        setParcels(parcelsData);
        setFilteredParcels(parcelsData);
        
        // Update analytics with total parcels count
        setAnalytics({
          totalParcels: totalParcelsFromAPI
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchParcelsForPage(page);
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchReceivedParcels();
  }, []);

  // Apply filters whenever filters state, searchTerm, or parcels change
  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, parcels]);

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
      weight: ''
    });
    setSearchTerm('');
    setFilteredParcels(parcels);
  };

  const applyFilters = () => {
    if (!parcels || parcels.length === 0) {
      setFilteredParcels([]);
      return;
    }
    
    let result = [...parcels];
    
    // Apply search term filter - search across multiple fields
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(parcel => {
        return (
          (parcel.parcelId && String(parcel.parcelId).toLowerCase().includes(searchLower)) ||
          (parcel.parcelName && parcel.parcelName.toLowerCase().includes(searchLower)) ||
          (parcel.senderName && parcel.senderName.toLowerCase().includes(searchLower)) ||
          (parcel.recipientName && parcel.recipientName.toLowerCase().includes(searchLower)) ||
          (parcel.from && parcel.from.toLowerCase().includes(searchLower)) ||
          (parcel.to && parcel.to.toLowerCase().includes(searchLower))
        );
      });
    }
    
    // Apply parcel ID filter
    if (filters.parcelId) {
      result = result.filter(parcel => 
        parcel.parcelId && String(parcel.parcelId).toLowerCase().includes(filters.parcelId.toLowerCase())
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
          </div>
        </div>
      )}

      {/* Search Filter */}
      <div className="search-filter-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Parcels"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-info">
            <span>Showing {filteredParcels.length} of {parcels.length} parcels</span>
            <button
              className="reset-search-btn"
              onClick={() => setSearchTerm('')}
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

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
                    <td>{parcel.weight || '-'}</td>
                    <td>{parcel.Date || new Date(parcel.createdAt).toLocaleDateString() || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="view-button" onClick={() => handleViewParcel(parcel)}>View</button>
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
      
      {/* Server-side Pagination */}
      {parcels.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            {totalPages > 1 
              ? `Showing ${((currentPage - 1) * pageSize) + 1} to ${Math.min(currentPage * pageSize, totalParcelCount)} of ${totalParcelCount} parcels`
              : `Showing ${totalParcelCount} of ${totalParcelCount} parcels`
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
    </div>
  );
};

export default ReceivedParcels;