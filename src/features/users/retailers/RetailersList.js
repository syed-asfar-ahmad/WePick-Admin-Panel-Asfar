import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaStore, FaCheckCircle, FaChartBar, FaTimes, FaSpinner, FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './RetailersList.scss';
import Loading from '../../../components/common/Loading';
import { getRetailers } from '../../../services/wepickApi';
import { getRetailerById, updateRetailerById } from '../../../services/wepickApi';

const RetailersList = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    dateRange: '',
    performance: '',
    location: ''
  });

  // Analytics data (from API)
  const [analytics, setAnalytics] = useState({
    totalRetailers: 0,
    activeRetailers: 0,
    inactiveRetailers: 0,
    averageSuccessRate: 0,
    topPerformingRetailers: []
  });

  // Retailers data from API
  const [retailers, setRetailers] = useState([]);

  // Fetch retailers from API
  const fetchRetailers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRetailers();
      // The API returns paginated data, so we need to access response.data.data for the retailers array
      setRetailers(response.data?.data || []);
      // Calculate analytics
      const total = (response.data?.data || []).length;
      const active = (response.data?.data || []).filter(r => r.status && r.status.toLowerCase() === 'active').length;
      const inactive = total - active;
      const avgSuccess = total > 0 ? Math.round((response.data?.data.reduce((sum, r) => sum + (r.performance?.successRate || 0), 0) / total)) : 0;
      // Top performing retailers (by successRate)
      const topPerforming = [...(response.data?.data || [])]
        .sort((a, b) => (b.performance?.successRate || 0) - (a.performance?.successRate || 0))
        .slice(0, 3);
      setAnalytics({
        totalRetailers: response.data?.totalRetailers || total,
        activeRetailers: active,
        inactiveRetailers: inactive,
        averageSuccessRate: avgSuccess,
        topPerformingRetailers: topPerforming
      });
    } catch (err) {
      setError('Failed to load retailers. Please try again.');
      setRetailers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRetailers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
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
      search: '',
      dateRange: '',
      performance: '',
      location: ''
    });
  };

  const handleApplyFilters = () => {
    // The filtering is already handled by getFilteredRetailers
    // This function is just to provide feedback to the user
    const filteredCount = getFilteredRetailers().length;
    alert(`Found ${filteredCount} retailers matching your criteria`);
  };

  const getFilteredRetailers = () => {
    return retailers.filter(retailer => {
      // Search filter
      if (filters.search && 
          !retailer.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !retailer.owner.toLowerCase().includes(filters.search.toLowerCase()) &&
          !retailer.email.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Date Range filter
      if (filters.dateRange) {
        const registrationDate = new Date(retailer.registrationDate);
        const filterDate = new Date(filters.dateRange);
        if (registrationDate < filterDate) {
          return false;
        }
      }

      // Performance filter
      if (filters.performance) {
        const successRate = retailer.performance.successRate;
        switch (filters.performance) {
          case 'high':
            if (successRate <= 90) return false;
            break;
          case 'medium':
            if (successRate < 80 || successRate > 90) return false;
            break;
          case 'low':
            if (successRate >= 80) return false;
            break;
        }
      }

      // Location filter
      if (filters.location && !retailer.address.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      return true;
    });
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? '#4CAF50' : '#F44336';
  };

  const handleViewRetailer = (retailerId) => {
    navigate(`/retailers/${retailerId}`);
  };

  const handleEditRetailer = async (retailer) => {
    try {
      setIsLoading(true);
      const response = await getRetailerById(retailer.id);
      setSelectedRetailer(response.data || retailer);
      setShowEditModal(true);
    } catch (err) {
      setError('Failed to load retailer details for editing.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateRetailerById(selectedRetailer.id, selectedRetailer);
      setShowEditModal(false);
      setSelectedRetailer(null);
      fetchRetailers(); // Refresh list after edit
    } catch (err) {
      setError('Failed to update retailer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRetailer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // if (error) {
  //   return (
  //     <div className="error-container">
  //       <div className="error-content">
  //         <FaExclamationTriangle className="error-icon" />
  //         <h2>Error Loading Retailers</h2>
  //         <p>{error}</p>
  //         <button className="retry-button" onClick={loadRetailers}>
  //           <FaRedo /> Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="retailers-list-container">
      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <div className="analytics-card">
          <FaStore />
          <div className="analytics-info">
            <h3>Total Retailers</h3>
            <p>{isLoading ? '...' : analytics.totalRetailers}</p>
          </div>
        </div>
      </div>

      <div className="page-header">
        <h1>Lists</h1>
        <div className="header-actions">
          <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      {showFilters && (
        <div className={`filters-section ${showFilters ? 'show' : 'hide'}`}>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search Retailers..."
              />
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

      {isLoading ? (
        <>
        <Loading />
        </>
      ) : (
        <>
        
        {/* </>
      )} */}

      {/* Edit Modal */}
      {showEditModal && selectedRetailer && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h2>Edit Retailer</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Store Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={selectedRetailer.businessName || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Owner</label>
                  <input
                    type="text"
                    name="name"
                    value={selectedRetailer.name || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Business Email</label>
                  <input
                    type="email"
                    name="businessEmail"
                    value={selectedRetailer.businessEmail || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={selectedRetailer.phoneNumber || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Business Address</label>
                  <input
                    type="text"
                    name="businessAddress"
                    value={selectedRetailer.businessAddress || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Business Registration Number</label>
                  <input
                    type="text"
                    name="businessRegistrationNumber"
                    value={selectedRetailer.businessRegistrationNumber || ''}
                    onChange={handleInputChange}
                  />
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

      {/* Table View */}
      <div className="view-content">
        <div className="table-container">
          {isLoading ? (
            <div className="loading-container">
              <FaSpinner className="spinner" />
              <p>Loading retailers...</p>
            </div>
          ) : (
            <table className="retailers-table">
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Owner</th>
                  <th>Business Email</th>
                  <th>Business Address</th>
                  <th>Business Registration Number</th>
                  <th>Total Parcels</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredRetailers().map((retailer) => (
                  <tr key={retailer.id}>
                    <td className="store-cell">
                      <FaStore className="store-icon" />
                      {retailer.name || retailer.storeName || retailer.businessName || 'N/A'}
                    </td>
                    <td>{retailer.owner}</td>
                    <td>{retailer.businessEmail}</td>
                    <td>{retailer.businessAddress}</td>
                    <td>{retailer.businessRegistrationNumber}</td>
                    <td>
                      <div className="metric">
                        <FaChartBar />
                        <span>{retailer.performance?.totalParcels || 0}</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="view-button" onClick={() => handleViewRetailer(retailer.id)}>View</button>
                        <button className="edit-button" onClick={() => handleEditRetailer(retailer)}>Edit</button>
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

export default RetailersList; 