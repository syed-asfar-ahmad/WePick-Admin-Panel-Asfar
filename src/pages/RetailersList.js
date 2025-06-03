import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaStore, FaCheckCircle, FaChartBar, FaTimes, FaSpinner, FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './RetailersList.scss';
import Loading from '../components/common/Loading';


const RetailersList = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    businessType: '',
    dateRange: '',
    performance: '',
    location: ''
  });

  // Analytics data
  const analytics = {
    totalRetailers: 156,
    activeRetailers: 142,
    inactiveRetailers: 14,
    averageSuccessRate: 92,
    topPerformingRetailers: [
      { name: 'Tech Gadgets Store', successRate: 98, parcels: 450 },
      { name: 'Fashion Boutique', successRate: 95, parcels: 380 },
      { name: 'Home Essentials', successRate: 94, parcels: 320 }
    ]
  };

  // Mock data for retailers
  const mockRetailers = [
    {
      id: 1,
      name: 'Tech Gadgets Store',
      owner: 'John Smith',
      email: 'john@techgadgets.com',
      phone: '+1 234-567-8901',
      address: '123 Tech Street, San Francisco, CA',
      businessType: 'Electronics',
      status: 'Active',
      registrationDate: '2023-01-15',
      performance: {
        successRate: 98,
        avgDeliveryTime: '2.3 hours',
        totalParcels: 450,
        customerRating: 4.8,
        revenue: '$45,000'
      }
    },
    {
      id: 2,
      name: 'Fashion Boutique',
      owner: 'Sarah Johnson',
      email: 'sarah@fashionboutique.com',
      phone: '+1 234-567-8902',
      address: '456 Style Avenue, San Francisco, CA',
      businessType: 'Fashion',
      status: 'Active',
      registrationDate: '2023-02-20',
      performance: {
        successRate: 95,
        avgDeliveryTime: '2.5 hours',
        totalParcels: 380,
        customerRating: 4.7,
        revenue: '$38,000'
      }
    },
    {
      id: 3,
      name: 'Home Essentials',
      owner: 'Mike Brown',
      email: 'mike@homeessentials.com',
      phone: '+1 234-567-8903',
      address: '789 Home Road, San Francisco, CA',
      businessType: 'Home Goods',
      status: 'Active',
      registrationDate: '2023-03-10',
      performance: {
        successRate: 94,
        avgDeliveryTime: '2.7 hours',
        totalParcels: 320,
        customerRating: 4.6,
        revenue: '$32,000'
      }
    },
    {
      id: 4,
      name: 'Gourmet Delights',
      owner: 'Emma Wilson',
      email: 'emma@gourmetdelights.com',
      phone: '+1 234-567-8904',
      address: '321 Food Street, San Francisco, CA',
      businessType: 'Food & Beverage',
      status: 'Active',
      registrationDate: '2023-04-05',
      performance: {
        successRate: 93,
        avgDeliveryTime: '2.4 hours',
        totalParcels: 280,
        customerRating: 4.9,
        revenue: '$28,000'
      }
    },
    {
      id: 5,
      name: 'Sports & Fitness',
      owner: 'David Chen',
      email: 'david@sportsfitness.com',
      phone: '+1 234-567-8905',
      address: '654 Sport Lane, San Francisco, CA',
      businessType: 'Sports',
      status: 'Active',
      registrationDate: '2023-05-15',
      performance: {
        successRate: 91,
        avgDeliveryTime: '2.6 hours',
        totalParcels: 250,
        customerRating: 4.5,
        revenue: '$25,000'
      }
    }
  ];

  // Simulate API call to fetch retailers
  const fetchRetailers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, this would be an API call
      return mockRetailers;
    } catch (err) {
      setError('Failed to load retailers. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const [retailers, setRetailers] = useState([]);

  useEffect(() => {
    loadRetailers();
  }, []);

  const loadRetailers = async () => {
    try {
      const data = await fetchRetailers();
      setRetailers(data);
    } catch (err) {
      console.error('Error loading retailers:', err);
    }
  };

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
      status: '',
      businessType: '',
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
      if (filters.search && !retailer.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !retailer.owner.toLowerCase().includes(filters.search.toLowerCase()) &&
          !retailer.email.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filters.status && retailer.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }

      // Business Type filter
      if (filters.businessType && retailer.businessType.toLowerCase() !== filters.businessType.toLowerCase()) {
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

  const handleEditRetailer = (retailer) => {
    setSelectedRetailer(retailer);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the retailer
    console.log('Saving changes for retailer:', selectedRetailer);
    setShowEditModal(false);
    setSelectedRetailer(null);
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
        <div className="analytics-card">
          <FaCheckCircle />
          <div className="analytics-info">
            <h3>Active Retailers</h3>
            <p>{isLoading ? '...' : analytics.activeRetailers}</p>
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
              <label>Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Business Type</label>
              <select name="businessType" value={filters.businessType} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home Goods</option>
                <option value="food">Food & Beverage</option>
                <option value="sports">Sports</option>
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
                    name="name"
                    value={selectedRetailer.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Owner</label>
                  <input
                    type="text"
                    name="owner"
                    value={selectedRetailer.owner}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={selectedRetailer.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={selectedRetailer.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={selectedRetailer.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Business Type</label>
                  <select
                    name="businessType"
                    value={selectedRetailer.businessType}
                    onChange={handleInputChange}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home Goods">Home Goods</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={selectedRetailer.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
                  <th>Business Type</th>
                  <th>Status</th>
                  <th>Total Parcels</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredRetailers().map((retailer) => (
                  <tr key={retailer.id}>
                    <td className="store-cell">
                      <FaStore className="store-icon" />
                      {retailer.name}
                    </td>
                    <td>{retailer.owner}</td>
                    <td>{retailer.businessType}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(retailer.status) }}
                      >
                        {retailer.status}
                      </span>
                    </td>
                    <td>
                      <div className="metric">
                        <FaChartBar />
                        <span>{retailer.performance.totalParcels}</span>
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