import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaStore, FaChartBar, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CustomersList.scss';
import Loading from '../../../components/common/Loading';
import { getCustomers, getCustomerById, updateCustomerById } from '../../../services/wepickApi';

const CustomersList = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [filterAnimation, setFilterAnimation] = useState('closed');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    businessType: '',
    dateRange: '',
    performance: '',
    location: ''
  });
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await getCustomers();
      
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
            console.error(`❌ Error fetching phone for customer ${customer.id}:`, err);
            return {
              ...customer,
              phoneNumber: 'N/A'
            };
          }
        })
      );
      
      setCustomers(customersWithPhoneNumbers);
      setTotalCustomers(customersWithPhoneNumbers.length);
    } catch (err) {
      console.error('❌ Error fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleFilters = () => {
    if (showFilters) {
      setFilterAnimation('closing');
      setTimeout(() => {
        setShowFilters(false);
        setFilterAnimation('closed');
      }, 500);
    } else {
      setShowFilters(true);
      setFilterAnimation('opening');
      setTimeout(() => {
        setFilterAnimation('open');
      }, 500);
    }
  };

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
    const filteredCount = getFilteredCustomers().length;
    alert(`Found ${filteredCount} customers matching your criteria`);
  };

  const getFilteredCustomers = () => {
    // Ensure customers is always an array
    if (!Array.isArray(customers)) {
      console.log('⚠️ Customers is not an array:', customers);
      return [];
    }

    return customers.filter(customer => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const customerName = customer.name.toLowerCase();
        const customerEmail = customer.email.toLowerCase();
        if (
          !customerName.includes(searchTerm) &&
          !customerEmail.includes(searchTerm)
        ) {
          return false;
        }
      }
      return true;
    });
  };

  const handleViewCustomer = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const handleEditCustomer = async (customer) => {
    try {
      setIsLoading(true);
      
      const response = await getCustomerById(customer.id);
      
      setSelectedCustomer(response.data || customer);
      setShowEditModal(true);
    } catch (err) {
      console.error('❌ Error loading customer for edit:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
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
        console.error('❌ Update failed:', response?.message);
      }
    } catch (err) {
      console.error('❌ Error saving customer:', err);
    } finally {
      setIsLoading(false);
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
        <div className="header-actions">
          <button className="filter-button" onClick={toggleFilters}>
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>
      {/* Enhanced Filters Section */}
      {showFilters && (
        <div className={`filters-section ${filterAnimation}`}>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search Customers..."
              />
            </div>
            {/* ...other filters remain unchanged... */}
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
                          <button className="edit-button" onClick={() => handleEditCustomer(customer)}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomersList;