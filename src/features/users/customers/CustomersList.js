import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaStore, FaChartBar, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CustomersList.scss';
import Loading from '../../../components/common/Loading';
import { getCustomers, getCustomerById, updateCustomerById } from '../../../services/wepickApi';

const CustomersList = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(20);

  // Fetch customers from API
  const fetchCustomers = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await getCustomers(page);
      
      let customersData = [];
      
      // Handle different response structures
      if (response?.data?.data?.list) {
        customersData = response.data.data.list;
      } else if (response?.data?.list) {
        customersData = response.data.list;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        customersData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        customersData = response.data;
      } else if (response?.data?.customers) {
        customersData = response.data.customers;
      } else {
        customersData = [];
      }
      
      // Fetch phone numbers for each customer
      const customersWithPhoneNumbers = await Promise.all(
        customersData.map(async (customer) => {
          try {
            const customerDetail = await getCustomerById(customer.id);
            return {
              ...customer,
              phoneNumber: customerDetail?.data?.phoneNumber || 'N/A'
            };
          } catch (err) {
            return {
              ...customer,
              phoneNumber: 'N/A'
            };
          }
        })
      );
      
      // Update pagination from API response
      setCurrentPage(response.data?.currentPage || page);
      setTotalPages(response.data?.totalPages || 1);
      setTotalCustomers(response.data?.totalCustomers || customersWithPhoneNumbers.length);
      
      setCustomers(customersWithPhoneNumbers);
    } catch (err) {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customers for specific page
  const fetchCustomersForPage = async (page) => {
    try {
      setIsLoading(true);
      const response = await getCustomers(page);
      
      let customersData = [];
      
      // Handle different response structures
      if (response?.data?.data?.list) {
        customersData = response.data.data.list;
      } else if (response?.data?.list) {
        customersData = response.data.list;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        customersData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        customersData = response.data;
      } else if (response?.data?.customers) {
        customersData = response.data.customers;
      } else {
        customersData = [];
      }
      
      // Fetch phone numbers for each customer
      const customersWithPhoneNumbers = await Promise.all(
        customersData.map(async (customer) => {
          try {
            const customerDetail = await getCustomerById(customer.id);
            return {
              ...customer,
              phoneNumber: customerDetail?.data?.phoneNumber || 'N/A'
            };
          } catch (err) {
            return {
              ...customer,
              phoneNumber: 'N/A'
            };
          }
        })
      );
      
      // Update pagination from API response
      setCurrentPage(response.data?.currentPage || page);
      setTotalPages(response.data?.totalPages || 1);
      setTotalCustomers(response.data?.totalCustomers || customersWithPhoneNumbers.length);
      
      setCustomers(customersWithPhoneNumbers);
    } catch (err) {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchCustomersForPage(page);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);



  const getFilteredCustomers = () => {
    if (!customers || customers.length === 0) {
      return [];
    }

    let filteredCustomers = customers;

    if (searchTerm.trim()) {
      filteredCustomers = customers.filter(customer => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (customer.name && customer.name.toLowerCase().includes(searchLower)) ||
          (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
          (customer.phoneNumber && customer.phoneNumber.toLowerCase().includes(searchLower))
        );
      });
    }

    // Sort by createdAt field (newest first)
    return filteredCustomers.sort((a, b) => {
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

  const handleViewCustomer = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const handleEditCustomer = async (customer) => {
    try {
      setIsEditLoading(true);
      
      const response = await getCustomerById(customer.id);
      
      setSelectedCustomer(response.data || customer);
      setShowEditModal(true);
    } catch (err) {
      // Handle error silently
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setIsEditLoading(true);
      
      // Only send the fields that should be updated
      const updateData = {
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phoneNumber: selectedCustomer.phoneNumber
      };
      

      
      const response = await updateCustomerById(selectedCustomer.id, updateData);

      
      if (response?.success) {
        setShowEditModal(false);
        setSelectedCustomer(null);
        fetchCustomers();
      } else {
        // Handle update failure silently
      }
    } catch (err) {
      // Handle error silently
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="retailers-list-container">
      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <div className="analytics-card">
          <FaStore />
          <div className="analytics-info">
            <h3>Total Customers</h3>
            <p>{isLoading ? "..." : totalCustomers}</p>
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
            placeholder="Search Customers"
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
            <span>Showing {getFilteredCustomers().length} of {customers.length} customers</span>
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
        <Loading />
      ) : (
        <>
          {/* Edit Modal */}
          {showEditModal && selectedCustomer && (
            <div className="modal-overlay">
              <div className="edit-modal">
                <div className="modal-header">
                  <h2>Edit Customer</h2>
                  <button className="close-button" onClick={() => setShowEditModal(false)}>
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleSaveEdit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={selectedCustomer.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={selectedCustomer.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={selectedCustomer.phoneNumber || ''}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="cancel-button" onClick={() => setShowEditModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="save-button" disabled={isEditLoading}>
                      {isEditLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Table View */}
          <div className="view-content">
            <div className="table-container">
              <table className="retailers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Total Parcels</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(getFilteredCustomers() || []).map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phoneNumber || 'N/A'}</td>
                      <td>{customer.totalParcels}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="view-button" onClick={() => handleViewCustomer(customer.id)}>View</button>
                          <button className="edit-button" onClick={() => handleEditCustomer(customer)} disabled={isEditLoading}>
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                              </tbody>
            </table>
          </div>
        </div>
        
        {/* Server-side Pagination */}
        {customers.length > 0 && totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCustomers)} of {totalCustomers} customers
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

export default CustomersList;