import React, { useState, useEffect } from 'react';
import { FaFilter, FaBox, FaCheckCircle, FaChartBar, FaTimes, FaSpinner, FaFileAlt, FaChartLine, FaSearch } from 'react-icons/fa';
import ParcelViewModal from './ParcelViewModal';
import ParcelEditModal from './ParcelEditModal';
import './ParcelsList.scss';
import Loading from '../../components/common/Loading';
import { getParcelSummary, getParcelReport, getParcelDetail, getParcels, updateParcel } from '../../services/wepickApi';

const ParcelsList = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [editingParcel, setEditingParcel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parcelSummary, setParcelSummary] = useState(null);
  const [parcelReport, setParcelReport] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [filters, setFilters] = useState({
    status: '',
    lockerId: '',
    dateRange: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalParcels: 0,
    activeParcels: 0,
    deliveredParcels: 0,
    averageDeliveryTime: '0 hours',
    topPerformingLockers: []
  });

  // Parcels data
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalParcelCount, setTotalParcelCount] = useState(0);
  const [pageSize] = useState(20);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
 

  const handleResetFilters = () => {
    setFilters({
      status: '',
      lockerId: '',
      dateRange: ''
    });
    setSearchTerm('');
  };

  const fetchParcelsData = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getParcels(page);
      
      if (response?.success) {
        const parcelsData = response.data?.parcels || [];
        
        // Ensure parcelsData is an array
        if (!Array.isArray(parcelsData)) {
          setParcels([]);
          setFilteredParcels([]);
          setError('Invalid data format received from server.');
          return;
        }
        
        // Update pagination from API response
        const totalParcelsFromAPI = response.data?.totalParcelCount || parcelsData.length;
        const calculatedTotalPages = Math.ceil(totalParcelsFromAPI / pageSize);
        
        setCurrentPage(response.data?.currentPage || page);
        setTotalPages(response.data?.totalPages || calculatedTotalPages);
        setTotalParcelCount(totalParcelsFromAPI);
        
        setParcels(parcelsData);
        setFilteredParcels(parcelsData);
        
        // Update analytics
        setAnalytics({
          totalParcels: totalParcelsFromAPI,
          activeParcels: 0,
          deliveredParcels: 0,
          averageDeliveryTime: '2.5 hours',
          topPerformingLockers: []
        });
      } else {
        setError('Failed to load parcels. Please try again.');
        setParcels([]);
        setFilteredParcels([]);
      }
    } catch (err) {
      setError('Failed to load parcels. Please try again.');
      setParcels([]);
      setFilteredParcels([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParcelsData();
  }, []);

  // Apply filters automatically whenever filters or searchTerm change
  useEffect(() => {
    const filtered = getFilteredParcels();
    setFilteredParcels(filtered);
  }, [filters, searchTerm, parcels]);

  // Fetch parcels for specific page
  const fetchParcelsForPage = async (page) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getParcels(page);
      
      if (response?.success) {
        const parcelsData = response.data?.parcels || [];
        
        // Update pagination from API response
        const totalParcelsFromAPI = response.data?.totalParcelCount || parcelsData.length;
        const calculatedTotalPages = Math.ceil(totalParcelsFromAPI / pageSize);
        
        setCurrentPage(response.data?.currentPage || page);
        setTotalPages(response.data?.totalPages || calculatedTotalPages);
        setTotalParcelCount(totalParcelsFromAPI);
        
        setParcels(parcelsData);
        setFilteredParcels(parcelsData);
        
        // Update analytics
        setAnalytics({
          totalParcels: totalParcelsFromAPI,
          activeParcels: 0,
          deliveredParcels: 0,
          averageDeliveryTime: '2.5 hours',
          topPerformingLockers: []
        });
      } else {
        setError('Failed to load parcels. Please try again.');
        setParcels([]);
        setFilteredParcels([]);
      }
    } catch (err) {
      setError('Failed to load parcels. Please try again.');
      setParcels([]);
      setFilteredParcels([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchParcelsForPage(page);
  };

  const getFilteredParcels = () => {
    if (!Array.isArray(parcels)) {
      return [];
    }

    // If no search term and no filters, return all parcels
    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    if (!hasActiveFilters && !searchTerm) {
      return parcels;
    }

    try {
      return parcels.filter(parcel => {
        // Ensure parcel is a valid object
        if (!parcel || typeof parcel !== 'object') {
          return false;
        }

        // Search filter - case-insensitive match for multiple fields
        if (searchTerm && searchTerm.trim() !== '') {
          const searchLower = searchTerm.toLowerCase().trim();
          
          // Check if any field contains the search term
          const searchableFields = [
            parcel.parcelId,
            parcel.parcelName,
            parcel.senderName,
            parcel.recipientName,
            parcel.businessName,
            parcel.customerName,
            parcel.from,
            parcel.to
          ];

          const hasMatch = searchableFields.some(field => {
            if (!field) return false;
            
            // Convert field to string for comparison (handles both string and number types)
            const fieldString = String(field).toLowerCase();
            return fieldString.includes(searchLower);
          });

          if (!hasMatch) {
            return false;
          }
        }

        // Status filter
        if (filters.status && filters.status.trim() !== '') {
          if (!parcel.status || parcel.status.toLowerCase() !== filters.status.toLowerCase()) {
            return false;
          }
        }

        // Date filter - specifically for createdDate column
        if (filters.dateRange && filters.dateRange.trim() !== '') {
          try {
            const filterDate = new Date(filters.dateRange);
            filterDate.setHours(0, 0, 0, 0); // Set to start of day
            
            // Only use createdDate field
            if (parcel.createdDate) {
              const parcelDate = new Date(parcel.createdDate);
              parcelDate.setHours(0, 0, 0, 0); // Set to start of day
              
              // Check if parcel was created on the selected date (exact match)
              if (parcelDate.getTime() !== filterDate.getTime()) {
                return false;
              }
            } else {
              // If no createdDate, exclude from results
              return false;
            }
          } catch (error) {
            return false;
          }
        }

        return true;
      });
    } catch (error) {
      return [];
    }
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
      case 'dispatched':
        return '#4CAF50';
      case 'ready for pickup':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const handleViewParcel = async (parcel) => {
    try {
      setIsLoading(true);
      const response = await getParcelDetail(parcel.id);
      if (response?.data) {
        setSelectedParcel(response.data);
      }
    } catch (err) {
      setError('Failed to load parcel details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditParcel = async (parcel) => {
    try {
      setIsLoading(true);
      const response = await getParcelDetail(parcel.id);
      if (response?.data) {
        setEditingParcel(response.data);
      } else {
        // Fallback to basic parcel data if API call fails
        setEditingParcel(parcel);
      }
    } catch (err) {
      // Fallback to basic parcel data if API call fails
      setEditingParcel(parcel);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveParcel = async (updatedParcel) => {
    try {
      setIsEditLoading(true);
      
      // Make API call to update parcel
      const response = await updateParcel(updatedParcel.id, updatedParcel);
      
      if (response?.success) {
        // If the updated parcel is currently being viewed, refresh its data
        if (selectedParcel && selectedParcel.id === updatedParcel.id) {
          try {
            const detailResponse = await getParcelDetail(updatedParcel.id);
            if (detailResponse?.data) {
              setSelectedParcel(detailResponse.data);
            }
          } catch (err) {
            // Handle refresh error silently
          }
        }
        
        // Clear parcels data, close modal, then fetch data (which will set loading)
        setParcels([]);
        setFilteredParcels([]);
        setEditingParcel(null);
        fetchParcelsData();
      } else {
        throw new Error('Failed to update parcel');
      }
    } catch (err) {
      setError('Failed to save parcel. Please try again.');
    } finally {
      setIsEditLoading(false);
    }
  };

  return (
    <div className="parcels-list-container">
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

      {/* Page Header */}
      <div className="page-header">
        <h1>Parcels Management</h1>
        <div className="header-actions">
          <button 
            className="filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            {showFilters ? 'Close Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className={`filters-section ${showFilters ? 'show' : 'hide'}`}>
                     <div className="filters-grid">
                          <div className="filter-group">
               <label>Status</label>
               <select name="status" value={filters.status} onChange={handleFilterChange}>
                 <option value="">All Status</option>
                 <option value="pending">Pending</option>
                 <option value="dispatched">Dispatched</option>
                 <option value="delivered">Delivered</option>
                 <option value="failed">Failed</option>
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
            placeholder="Search parcels"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
            }}
            className="search-input"
            disabled={isLoading}
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
            <span>
              {getFilteredParcels().length === 0 
                ? `No parcels found for "${searchTerm}"` 
                : `Showing ${getFilteredParcels().length} of ${parcels.length} parcels`
              }
            </span>
            <button
              className="reset-search-btn"
              onClick={() => setSearchTerm('')}
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

      {/* Table View */}
      <div className="view-content">
        <div className="table-container">
          {isLoading ? (
            <>
             <Loading /> 
            </>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
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
                  <th>Parcel Name</th>
                  <th>Status</th>
                  <th>Sender Name</th>
                  <th>Recipient Name</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Created Date</th>
                  <th>Weight</th>
                  <th>Business Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredParcels().map((parcel) => (
                  <tr key={parcel.id}>
                                         <td className="parcel-cell">
                       <span>{parcel.parcelName || 'N/A'}</span>
                     </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(parcel.status) }}
                      >
                        {parcel.status}
                      </span>
                    </td>
                    <td>{parcel.senderName || 'N/A'}</td>
                    <td>{parcel.recipientName || 'N/A'}</td>
                    <td>{parcel.from}</td>
                    <td>{parcel.to}</td>
                    <td>{parcel.createdDate}</td>
                    <td>{parcel.weight || '-'}</td>
                    <td>{parcel.businessName || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-button view"
                          onClick={() => handleViewParcel(parcel)}
                        >
                          View
                        </button>
                        <button 
                          className="action-button edit" 
                          onClick={() => handleEditParcel(parcel)}
                          disabled={parcel.status?.toLowerCase() === 'delivered'}
                        >
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

      {/* Parcel View Modal */}
      {selectedParcel && (
        <ParcelViewModal
          parcel={selectedParcel}
          onClose={() => setSelectedParcel(null)}
        />
      )}

      {editingParcel && (
        <ParcelEditModal
          parcel={editingParcel}
          onClose={() => setEditingParcel(null)}
          onSave={handleSaveParcel}
          isEditLoading={isEditLoading}
        />
      )}
    </div>
  );
};

export default ParcelsList; 