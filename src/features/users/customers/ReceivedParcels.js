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
  const [error, setError] = useState(null);
  const [totalParcelCount, setTotalParcelCount] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState({
    dateRange: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalParcels: 0
  });

  // Fetch received parcels with search functionality
  const fetchReceivedParcelsWithSearch = async (page = 1, searchQuery = '', dateFilter = '') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getReceivedParcels(page, searchQuery, dateFilter);
      
      if (response?.success) {
        const parcelsData = response.data?.parcels || response.data?.data || response.data || [];
        const totalParcelsFromAPI = response.data?.totalParcels || response.data?.totalCount || 0;
        const totalPagesFromAPI = response.data?.totalPages || 1;
        
        setParcels(parcelsData);
        setTotalParcelCount(totalParcelsFromAPI);
        setTotalPages(totalPagesFromAPI);
        setCurrentPage(response.data?.currentPage || page);
        
        // Update analytics with total parcels count
        setAnalytics({
          totalParcels: totalParcelsFromAPI
        });
      } else {
        setError('Failed to load received parcels. Please try again.');
        setParcels([]);
        setTotalParcelCount(0);
        setTotalPages(1);
      }
    } catch (err) {
      setError('Failed to load received parcels. Please try again.');
      setParcels([]);
      setTotalParcelCount(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch parcels for specific page
  const fetchParcelsForPage = async (page) => {
    fetchReceivedParcelsWithSearch(page, searchTerm, filters.dateRange);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchParcelsForPage(page);
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchReceivedParcelsWithSearch(1, '', '');
  }, []);

  // Reset search and pagination
  const resetSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchReceivedParcelsWithSearch(1, '', filters.dateRange);
  };


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
    
    // Don't search if already loading
    if (isLoading) {
      return;
    }
    
    // Debounce search to avoid multiple API calls
    clearTimeout(window.dateTimeout);
    window.dateTimeout = setTimeout(() => {
      fetchReceivedParcelsWithSearch(1, searchTerm, value);
    }, 500);
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: ''
    });
    setSearchTerm('');
    fetchReceivedParcelsWithSearch(1, '', '');
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
            <FaFilter style={{ color: '#4CAF50' }} /> {showFilters ? 'Close Filters' : 'Show Filters'}
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
                fetchReceivedParcelsWithSearch(1, searchValue, filters.dateRange);
              }, 1800);
            }}
            className={`search-input ${isLoading ? 'disabled' : ''}`}
            disabled={isLoading}
          />
          {searchTerm && (
            <button
              className="reset-search-btn"
              onClick={resetSearch}
              disabled={isLoading}
            >
              Reset Search
            </button>
          )}
        </div>
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
              {paginatedParcels.length > 0 ? (
                paginatedParcels.map((parcel) => (
                  <tr key={parcel.id} className="clickable-row">
                    <td>{parcel.parcelId || parcel.id}</td>
                    <td>{parcel.parcelName || 'N/A'}</td>
                    <td>{parcel.senderName || 'N/A'}</td>
                    <td>{parcel.recipientName || 'N/A'}</td>
                    <td>{parcel.from || 'N/A'}</td>
                    <td>{parcel.to || 'N/A'}</td>
                    <td>{parcel.weight ? `${parcel.weight}kg` : '-'}</td>
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
      {paginatedParcels.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            {!searchTerm && !filters.dateRange ? (
              totalPages > 1 
                ? `Showing ${((currentPage - 1) * pageSize) + 1} to ${Math.min(currentPage * pageSize, totalParcelCount)} of ${totalParcelCount} parcels`
                : `Showing ${paginatedParcels.length} of ${totalParcelCount} parcels`
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

export default ReceivedParcels;