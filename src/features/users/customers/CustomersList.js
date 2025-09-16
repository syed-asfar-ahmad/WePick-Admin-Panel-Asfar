import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaStore, FaChartBar, FaTimes, FaEdit, FaUser, FaEnvelope, FaPhone, FaIdCard, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CustomersList.scss';
import Loading from '../../../components/common/Loading';
import { getCustomers, getCustomerById, updateCustomerById } from '../../../services/wepickApi';
import { CustomToast } from '../../../atoms/toastMessage';

const CustomersList = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [originalCustomerData, setOriginalCustomerData] = useState(null);
  const [hasFormChanges, setHasFormChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [actualTotalCustomers, setActualTotalCustomers] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(20);

  // Fetch customers with search functionality
  const fetchCustomersWithSearch = async (page = 1, searchQuery = '') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getCustomers(page, searchQuery);
      
      if (response?.success) {
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
        
        // Fetch phone numbers and totalParcels for each customer
        const customersWithDetails = await Promise.all(
          customersData.map(async (customer) => {
            try {
              const customerDetail = await getCustomerById(customer.id);
              return {
                ...customer,
                phoneNumber: customerDetail?.data?.phoneNumber || 'N/A',
                totalParcels: customerDetail?.data?.totalParcels || 0
              };
            } catch (err) {
              return {
                ...customer,
                phoneNumber: 'N/A',
                totalParcels: 0
              };
            }
          })
        );
        
        setCustomers(customersWithDetails);
        setTotalCustomers(response.data?.totalCustomers || customersWithDetails.length);
        
        // Only update actual total count on initial load (no search term)
        if (!searchQuery) {
          setActualTotalCustomers(response.data?.totalCustomers || customersWithDetails.length);
        }
        
        setTotalPages(response.data?.totalPages || 1);
        setCurrentPage(response.data?.currentPage || page);
      } else {
        setError('Failed to load customers. Please try again.');
        setCustomers([]);
        setTotalCustomers(0);
        setTotalPages(1);
      }
    } catch (err) {
      setError('Failed to load customers. Please try again.');
      setCustomers([]);
      setTotalCustomers(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customers for specific page
  const fetchCustomersForPage = async (page) => {
    fetchCustomersWithSearch(page, searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchCustomersForPage(page);
  };

  useEffect(() => {
    fetchCustomersWithSearch(1, '');
  }, []);

  // Reset search and pagination
  const resetSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchCustomersWithSearch(1, ''); // Fetch all customers without search
  };



  // Use customers directly since API handles search and pagination
  const paginatedCustomers = customers;

  const handleViewCustomer = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const handleEditCustomer = async (customer) => {
    try {
      setIsEditLoading(true);
      
      const response = await getCustomerById(customer.id);
      
      const customerData = response.data || customer;
      setSelectedCustomer(customerData);
      setOriginalCustomerData(customerData);
      setShowEditModal(true);
      // Reset change tracking
      setHasFormChanges(false);
    } catch (err) {
      CustomToast({
        type: "error",
        message: 'Failed to load customer details for editing.'
      });
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
        CustomToast({
          type: "success",
          message: response?.message || response?.data?.message || "Customer updated successfully"
        });
        setShowEditModal(false);
        setSelectedCustomer(null);
        setOriginalCustomerData(null);
        setHasFormChanges(false);
        fetchCustomersWithSearch(1, searchTerm);
      } else {
        throw new Error('Failed to update customer');
      }
    } catch (err) {
      CustomToast({
        type: "error",
        message: err?.response?.data?.message || err?.message || 'Failed to update customer. Please try again.'
      });
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
    
    // Check if there are any changes compared to original data
    setTimeout(() => {
      const hasChanges = checkForChanges();
      setHasFormChanges(hasChanges);
    }, 0);
  };

  // Function to check if form has any changes
  const checkForChanges = () => {
    if (!originalCustomerData || !selectedCustomer) return false;
    
    // Check all fields
    if (originalCustomerData.name !== selectedCustomer.name) return true;
    if (originalCustomerData.email !== selectedCustomer.email) return true;
    if (originalCustomerData.phoneNumber !== selectedCustomer.phoneNumber) return true;
    
    return false;
  };

  return (
    <div className="retailers-list-container">
      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <div className="analytics-card">
          <FaStore />
          <div className="analytics-info">
            <h3>Total Customers</h3>
            <p>{isLoading ? "..." : actualTotalCustomers}</p>
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
                fetchCustomersWithSearch(1, searchValue);
              }, 1800);
            }}
            className={`search-input ${isLoading ? 'disabled' : ''}`}
            disabled={isLoading}
          />
        </div>
        {searchTerm && (
          <div className="search-results-info">
            <button
              className="reset-search-btn"
              onClick={resetSearch}
              disabled={isLoading}
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
                  <div className="header-content">
                    <div className="header-icon-wrapper">
                      <FaEdit className="header-icon" />
                    </div>
                    <h2>Edit Customer</h2>
                  </div>
                  <button className="close-button" onClick={() => setShowEditModal(false)} disabled={isEditLoading}>
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleSaveEdit}>
                  <div className="modal-content">
                    <div className="form-grid">
                      {/* Personal Information Section */}
                      <div className="form-section">
                        <div className="section-header">
                          <div className="section-icon-wrapper">
                            <FaUser className="section-icon" />
                          </div>
                          <h3>Personal Information</h3>
                        </div>
                        <div className="form-group">
                          <label>
                            <FaIdCard className="input-icon" />
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={selectedCustomer.name}
                            onChange={handleInputChange}
                            disabled={isEditLoading}
                            className="form-control"
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <FaEnvelope className="input-icon" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={selectedCustomer.email}
                            onChange={handleInputChange}
                            disabled={isEditLoading}
                            className="form-control"
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <FaPhone className="input-icon" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={selectedCustomer.phoneNumber || ''}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            disabled={isEditLoading}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="cancel-button" 
                      onClick={() => {
                        // Reset form to original values
                        if (originalCustomerData) {
                          setSelectedCustomer(originalCustomerData);
                          setHasFormChanges(false);
                        }
                      }} 
                      disabled={isEditLoading}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="save-button" disabled={isEditLoading || !hasFormChanges}>
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
                  {(paginatedCustomers || []).map((customer) => (
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
              {!searchTerm ? (
                `Showing ${((currentPage - 1) * pageSize) + 1} to ${Math.min(currentPage * pageSize, totalCustomers)} of ${totalCustomers} customers`
              ) : null}
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