import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaStore, FaCheckCircle, FaChartBar, FaTimes, FaSpinner, FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './RetailersList.scss';
import Loading from '../../../components/common/Loading';
import { getRetailers } from '../../../services/wepickApi';
import { getRetailerById, updateRetailerById } from '../../../services/wepickApi';

const RetailersList = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRetailers, setTotalRetailers] = useState(0);
  const [pageSize] = useState(20);

  // Sorting state for store name
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch retailers from API
  const fetchRetailers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRetailers();
      
      if (response?.success) {
        const retailersData = response.data?.data || [];
        setRetailers(retailersData);
        
        // Update pagination from API response
        const totalRetailersCount = response.data?.totalRetailers || 0;
        const totalPagesCount = response.data?.totalPages || 1;
        
        setCurrentPage(response.data?.currentPage || 1);
        setTotalPages(totalPagesCount);
        setTotalRetailers(totalRetailersCount);
        
        // Calculate analytics
        const total = totalRetailersCount;
        const active = retailersData.filter(r => r.status && r.status.toLowerCase() === 'active').length;
        const inactive = total - active;
        const avgSuccess = total > 0 ? Math.round((retailersData.reduce((sum, r) => sum + (r.performance?.successRate || 0), 0) / total)) : 0;
        // Top performing retailers (by successRate)
        const topPerforming = [...retailersData]
          .sort((a, b) => (b.performance?.successRate || 0) - (a.performance?.successRate || 0))
          .slice(0, 3);
        setAnalytics({
          totalRetailers: total,
          activeRetailers: active,
          inactiveRetailers: inactive,
          averageSuccessRate: avgSuccess,
          topPerformingRetailers: topPerforming
        });
      } else {
        setError('Failed to load retailers. Please try again.');
        setRetailers([]);
      }
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

  // Fetch retailers for specific page
  const fetchRetailersForPage = async (page) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRetailers(page);
      
      if (response?.success) {
        const retailersData = response.data?.data || [];
        setRetailers(retailersData);
        
        // Update pagination from API response
        const totalRetailersCount = response.data?.totalRetailers || 0;
        const totalPagesCount = response.data?.totalPages || 1;
        
        setCurrentPage(response.data?.currentPage || page);
        setTotalPages(totalPagesCount);
        setTotalRetailers(totalRetailersCount);
      } else {
        setError('Failed to load retailers. Please try again.');
      }
    } catch (err) {
      setError('Failed to load retailers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchRetailersForPage(page);
  };

  // Handle sorting
  const handleSort = (field, order) => {
    if (order === 'clear') {
      setSortField(null);
      setSortOrder('asc');
    } else {
      setSortField(field);
      setSortOrder(order);
    }
  };

  // Create dropdown items for store name sorting
  const getDropdownItems = () => {
    const items = [
      {
        key: 'storeName-asc',
        label: 'Ascending',
        onClick: () => handleSort('storeName', 'asc'),
      },
      {
        key: 'storeName-desc',
        label: 'Descending',
        onClick: () => handleSort('storeName', 'desc'),
      },
    ];

    // Add "Clear Sort" option if currently sorted
    if (sortField === 'storeName') {
      items.push({
        key: 'storeName-clear',
        label: 'Clear Sort',
        onClick: () => handleSort('storeName', 'clear'),
      });
    }

    return items;
  };

  // Filter retailers based on search term and apply sorting
  const getFilteredRetailers = () => {
    let filteredRetailers = retailers;
    
    if (searchTerm.trim()) {
      filteredRetailers = retailers.filter(retailer => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (retailer.storeName && retailer.storeName.toLowerCase().includes(searchLower)) ||
          (retailer.name && retailer.name.toLowerCase().includes(searchLower)) ||
          (retailer.owner && retailer.owner.toLowerCase().includes(searchLower)) ||
          (retailer.businessEmail && retailer.businessEmail.toLowerCase().includes(searchLower)) ||
          (retailer.businessAddress && retailer.businessAddress.toLowerCase().includes(searchLower)) ||
          (retailer.businessRegistrationNumber && retailer.businessRegistrationNumber.toLowerCase().includes(searchLower))
        );
      });
    }
    
    // Apply sorting if sortField is set
    if (sortField === 'storeName') {
      return filteredRetailers.sort((a, b) => {
        const aValue = (a.storeName || a.name || '').toLowerCase();
        const bValue = (b.storeName || b.name || '').toLowerCase();
        
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }
    
    // Default sort by createdAt field (newest first) if no custom sorting
    return filteredRetailers.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; // Descending order (newest first)
      }
      // Fallback to ObjectId if createdAt is not available
      if (a.id && b.id) {
        return b.id.localeCompare(a.id);
      }
      return 0;
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
      setIsEditLoading(true);
      await updateRetailerById(selectedRetailer.id, selectedRetailer);
      setShowEditModal(false);
      setSelectedRetailer(null);
      fetchRetailers(); // Refresh list after edit
    } catch (err) {
      setError('Failed to update retailer.');
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRetailer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredRetailers = getFilteredRetailers();

  return (
    <div className="retailers-list-container">
      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <div className="analytics-card">
          <FaStore />
          <div className="analytics-info">
            <h3>Total Retailers</h3>
            <p>{isLoading ? "..." : analytics.totalRetailers}</p>
          </div>
        </div>
      </div>

      <div className="page-header">
        <h1>Lists</h1>
      </div>

      {/* Search Filter */}
      <div className="search-filter-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Retailers"
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
            <span>Showing {filteredRetailers.length} of {retailers.length} retailers</span>
            <button 
              className="reset-search-btn"
              onClick={() => setSearchTerm('')}
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedRetailer && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h2>Edit Retailer</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)} disabled={isEditLoading}>
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
                    disabled={isEditLoading}
                  />
                </div>
                <div className="form-group">
                  <label>Owner</label>
                  <input
                    type="text"
                    name="name"
                    value={selectedRetailer.name || ''}
                    onChange={handleInputChange}
                    disabled={isEditLoading}
                  />
                </div>
                <div className="form-group">
                  <label>Business Email</label>
                  <input
                    type="email"
                    name="businessEmail"
                    value={selectedRetailer.businessEmail || ''}
                    onChange={handleInputChange}
                    disabled={isEditLoading}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={selectedRetailer.phoneNumber || ''}
                    onChange={handleInputChange}
                    disabled={isEditLoading}
                  />
                </div>
                <div className="form-group">
                  <label>Business Address</label>
                  <input
                    type="text"
                    name="businessAddress"
                    value={selectedRetailer.businessAddress || ''}
                    onChange={handleInputChange}
                    disabled={isEditLoading}
                  />
                </div>
                <div className="form-group">
                  <label>Business Registration Number</label>
                  <input
                    type="text"
                    name="businessRegistrationNumber"
                    value={selectedRetailer.businessRegistrationNumber || ''}
                    onChange={handleInputChange}
                    disabled={isEditLoading}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowEditModal(false)} disabled={isEditLoading}>
                  Cancel
                </button>
                <button type="submit" className="save-button" disabled={isEditLoading}>
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

      {/* Table View */}
      <div className="view-content">
        <div className="table-container">
          {retailers.length === 0 ? (
            <div className="no-data-container">
              <p className="error-message">Failed to Load the Retailers Data. Please try again later.</p>
              <button 
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <table className="retailers-table">
              <thead>
                <tr>
                  <th>
                    <div className="column-header">
                      <span>Store Name</span>
                      <Dropdown
                        menu={{ items: getDropdownItems() }}
                        trigger={['click']}
                        placement="bottomLeft"
                      >
                        <Button 
                          type="text" 
                          size="small"
                          className={`sort-dropdown ${sortField === 'storeName' ? 'active' : ''}`}
                          icon={<DownOutlined />}
                        />
                      </Dropdown>
                    </div>
                  </th>
                  <th>Owner</th>
                  <th>Business Email</th>
                  <th>Business Address</th>
                  <th>Business Registration Number</th>
                  <th>Total Parcels</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRetailers.map((retailer) => (
                  <tr key={retailer.id}>
                    <td className="store-cell">
                      <FaStore className="store-icon" />
                      {retailer.storeName || retailer.name || 'N/A'}
                    </td>
                    <td>{retailer.owner}</td>
                    <td>{retailer.businessEmail}</td>
                    <td>{retailer.businessAddress}</td>
                    <td>{retailer.businessRegistrationNumber}</td>
                    <td>
                      <div className="metric">
                        <FaChartBar />
                        <span>{retailer.totalParcels || 0}</span>
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
      
      {/* Server-side Pagination */}
      {retailers.length > 0 && totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRetailers)} of {totalRetailers} retailers
          </div>
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
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default RetailersList; 