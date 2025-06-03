// import React, { useState } from 'react';
// import { FaSearch, FaFilter, FaStore, FaCheckCircle, FaChartBar, FaTimes } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import './CustomersList.scss';

// const CustomersList = () => {
//   const navigate = useNavigate();
//   const [showFilters, setShowFilters] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedRetailer, setSelectedRetailer] = useState(null);
//   const [filters, setFilters] = useState({
//     search: '',
//     status: '',
//     businessType: '',
//     dateRange: '',
//     performance: '',
//     location: ''
//   });

//   // Analytics data
//   const analytics = {
//     totalRetailers: 156,
//     activeRetailers: 142,
//     inactiveRetailers: 14,
//     averageSuccessRate: 92,
//     topPerformingRetailers: [
//       { name: 'Tech Gadgets Store', successRate: 98, parcels: 450 },
//       { name: 'Fashion Boutique', successRate: 95, parcels: 380 },
//       { name: 'Home Essentials', successRate: 94, parcels: 320 }
//     ]
//   };

//   // Mock data for retailers
//   const retailers = [
//     {
//       id: 1,
//       name: 'Tech Gadgets Store',
//       owner: 'John Smith',
//       email: 'john@techgadgets.com',
//       phone: '+1 234-567-8901',
//       address: '123 Tech Street, San Francisco, CA',
//       businessType: 'Electronics',
//       status: 'Active',
//       registrationDate: '2023-01-15',
//       performance: {
//         successRate: 98,
//         avgDeliveryTime: '2.3 hours',
//         totalParcels: 450,
//         customerRating: 4.8,
//         revenue: '$45,000'
//       }
//     },
//     {
//       id: 2,
//       name: 'Fashion Boutique',
//       owner: 'Sarah Johnson',
//       email: 'sarah@fashionboutique.com',
//       phone: '+1 234-567-8902',
//       address: '456 Style Avenue, San Francisco, CA',
//       businessType: 'Fashion',
//       status: 'Active',
//       registrationDate: '2023-02-20',
//       performance: {
//         successRate: 95,
//         avgDeliveryTime: '2.5 hours',
//         totalParcels: 380,
//         customerRating: 4.7,
//         revenue: '$38,000'
//       }
//     },
//     {
//       id: 3,
//       name: 'Home Essentials',
//       owner: 'Mike Brown',
//       email: 'mike@homeessentials.com',
//       phone: '+1 234-567-8903',
//       address: '789 Home Road, San Francisco, CA',
//       businessType: 'Home Goods',
//       status: 'Active',
//       registrationDate: '2023-03-10',
//       performance: {
//         successRate: 94,
//         avgDeliveryTime: '2.7 hours',
//         totalParcels: 320,
//         customerRating: 4.6,
//         revenue: '$32,000'
//       }
//     },
//     {
//       id: 4,
//       name: 'Gourmet Delights',
//       owner: 'Emma Wilson',
//       email: 'emma@gourmetdelights.com',
//       phone: '+1 234-567-8904',
//       address: '321 Food Street, San Francisco, CA',
//       businessType: 'Food & Beverage',
//       status: 'Active',
//       registrationDate: '2023-04-05',
//       performance: {
//         successRate: 93,
//         avgDeliveryTime: '2.4 hours',
//         totalParcels: 280,
//         customerRating: 4.9,
//         revenue: '$28,000'
//       }
//     },
//     {
//       id: 5,
//       name: 'Sports & Fitness',
//       owner: 'David Chen',
//       email: 'david@sportsfitness.com',
//       phone: '+1 234-567-8905',
//       address: '654 Sport Lane, San Francisco, CA',
//       businessType: 'Sports',
//       status: 'Active',
//       registrationDate: '2023-05-15',
//       performance: {
//         successRate: 91,
//         avgDeliveryTime: '2.6 hours',
//         totalParcels: 250,
//         customerRating: 4.5,
//         revenue: '$25,000'
//       }
//     }
//   ];

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       search: '',
//       status: '',
//       businessType: '',
//       dateRange: '',
//       performance: '',
//       location: ''
//     });
//   };

//   const handleApplyFilters = () => {
//     const filteredCount = getFilteredRetailers().length;
//     alert(`Found ${filteredCount} retailers matching your criteria`);
//   };

//   const getFilteredRetailers = () => {
//     return retailers.filter(retailer => {
//       // Search filter (case-insensitive)
//       if (filters.search) {
//         const searchTerm = filters.search.toLowerCase();
//         const retailerName = retailer.owner.toLowerCase();
//         const retailerEmail = retailer.email.toLowerCase();
//         const retailerPhone = retailer.phone.toLowerCase();

//         if (
//           !retailerName.includes(searchTerm) &&
//           !retailerEmail.includes(searchTerm) &&
//           !retailerPhone.includes(searchTerm)
//         ) {
//           return false;
//         }
//       }

//       // Status filter
//       if (filters.status && retailer.status.toLowerCase() !== filters.status.toLowerCase()) {
//         return false;
//       }

//       // Business Type filter
//       if (filters.businessType && retailer.businessType.toLowerCase() !== filters.businessType.toLowerCase()) {
//         return false;
//       }

//       // Date Range filter
//       if (filters.dateRange) {
//         const registrationDate = new Date(retailer.registrationDate);
//         const filterDate = new Date(filters.dateRange);
//         if (registrationDate < filterDate) {
//           return false;
//         }
//       }

//       // Performance filter
//       if (filters.performance) {
//         const successRate = retailer.performance.successRate;
//         switch (filters.performance) {
//           case 'high':
//             if (successRate <= 90) return false;
//             break;
//           case 'medium':
//             if (successRate < 80 || successRate > 90) return false;
//             break;
//           case 'low':
//             if (successRate >= 80) return false;
//             break;
//         }
//       }

//       // Location filter
//       if (filters.location && !retailer.address.toLowerCase().includes(filters.location.toLowerCase())) {
//         return false;
//       }

//       return true;
//     });
//   };

//   const getStatusColor = (status) => {
//     return status === 'Active' ? '#4CAF50' : '#F44336';
//   };

//   const handleViewRetailer = (retailerId) => {
//     navigate(`/customers/${retailerId}`);
//   };

//   const handleEditRetailer = (retailer) => {
//     setSelectedRetailer(retailer);
//     setShowEditModal(true);
//   };

//   const handleSaveEdit = (e) => {
//     e.preventDefault();
//     console.log('Saving changes for retailer:', selectedRetailer);
//     setShowEditModal(false);
//     setSelectedRetailer(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedRetailer(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <div className="retailers-list-container">
//       {/* Analytics Dashboard */}
//       <div className="analytics-dashboard">
//         <div className="analytics-card">
//           <FaStore />
//           <div className="analytics-info">
//             <h3>Total Customers</h3>
//             <p>{analytics.totalRetailers}</p>
//           </div>
//         </div>
//         <div className="analytics-card">
//           <FaCheckCircle />
//           <div className="analytics-info">
//             <h3>Active Customers</h3>
//             <p>{analytics.activeRetailers}</p>
//           </div>
//         </div>
//       </div>

//       <div className="page-header">
//         <h1>Lists</h1>
//         <div className="header-actions">
//           <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
//             <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
//           </button>
//         </div>
//       </div>

//       {/* Enhanced Filters Section */}
//       {showFilters && (
//         <div className="filters-section">
//           <div className="filters-grid">
//             <div className="filter-group">
//               <label>Search</label>
//               <input
//                 type="text"
//                 name="search"
//                 value={filters.search}
//                 onChange={handleFilterChange}
//                 placeholder="Search Customers..."
//               />
//             </div>
//             <div className="filter-group">
//               <label>Status</label>
//               <select name="status" value={filters.status} onChange={handleFilterChange}>
//                 <option value="">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//             <div className="filter-group">
//               <label>Order Type</label>
//               <select name="businessType" value={filters.businessType} onChange={handleFilterChange}>
//                 <option value="">All Types</option>
//                 <option value="electronics">Electronics</option>
//                 <option value="fashion">Fashion</option>
//                 <option value="home">Home Goods</option>
//                 <option value="food">Food & Beverage</option>
//                 <option value="sports">Sports</option>
//               </select>
//             </div>
//             <div className="filter-group">
//               <label>Date Range</label>
//               <input
//                 type="date"
//                 name="dateRange"
//                 value={filters.dateRange}
//                 onChange={handleFilterChange}
//               />
//             </div>
//             <div className="filter-group">
//               <label>Performance</label>
//               <select name="performance" value={filters.performance} onChange={handleFilterChange}>
//                 <option value="">All Performance</option>
//                 <option value="high">High (&gt;90%)</option>
//                 <option value="medium">Medium (80-90%)</option>
//                 <option value="low">Low (&lt;80%)</option>
//               </select>
//             </div>
//             <div className="filter-group">
//               <label>Location</label>
//               <input
//                 type="text"
//                 name="location"
//                 value={filters.location}
//                 onChange={handleFilterChange}
//                 placeholder="Enter location..."
//               />
//             </div>
//           </div>
//           <div className="filter-actions">
//             <button className="reset-button" onClick={handleResetFilters}>
//               Reset Filters
//             </button>
//             <button className="apply-button" onClick={handleApplyFilters}>
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && selectedRetailer && (
//         <div className="modal-overlay">
//           <div className="edit-modal">
//             <div className="modal-header">
//               <h2>Edit Customer</h2>
//               <button className="close-button" onClick={() => setShowEditModal(false)}>
//                 <FaTimes />
//               </button>
//             </div>
//             <form onSubmit={handleSaveEdit}>
//               <div className="form-grid">
//                 <div className="form-group">
//                   <label>Name</label>
//                   <input
//                     type="text"
//                     name="owner"
//                     value={selectedRetailer.owner}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={selectedRetailer.email}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Phone</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={selectedRetailer.phone}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Address</label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={selectedRetailer.address}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Order Type</label>
//                   <select
//                     name="businessType"
//                     value={selectedRetailer.businessType}
//                     onChange={handleInputChange}
//                   >
//                     <option value="Electronics">Electronics</option>
//                     <option value="Fashion">Fashion</option>
//                     <option value="Home Goods">Home Goods</option>
//                     <option value="Food & Beverage">Food & Beverage</option>
//                     <option value="Sports">Sports</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label>Status</label>
//                   <select
//                     name="status"
//                     value={selectedRetailer.status}
//                     onChange={handleInputChange}
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="modal-actions">
//                 <button type="button" className="cancel-button" onClick={() => setShowEditModal(false)}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="save-button">
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Table View */}
//       <div className="view-content">
//         <div className="table-container">
//           <table className="retailers-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Order Type</th>
//                 <th>Status</th>
//                 <th>Total Parcels</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getFilteredRetailers().map((retailer) => (
//                 <tr key={retailer.id}>
//                   <td>{retailer.owner}</td>
//                   <td>{retailer.businessType}</td>
//                   <td>
//                     <span 
//                       className="status-badge"
//                       style={{ backgroundColor: getStatusColor(retailer.status) }}
//                     >
//                       {retailer.status}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="metric">
//                       <FaChartBar />
//                       <span>{retailer.performance.totalParcels}</span>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="action-buttons">
//                       <button className="view-button" onClick={() => handleViewRetailer(retailer.id)}>View</button>
//                       <button className="edit-button" onClick={() => handleEditRetailer(retailer)}>Edit</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomersList;


import React, { useState } from 'react';
import { FaSearch, FaFilter, FaStore, FaCheckCircle, FaChartBar, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CustomersList.scss';
import Loading from '../common/Loading';

const CustomersList = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [filterAnimation, setFilterAnimation] = useState('closed');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
  const retailers = [
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
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
    const filteredCount = getFilteredRetailers().length;
    alert(`Found ${filteredCount} retailers matching your criteria`);
  };

  const getFilteredRetailers = () => {
    return retailers.filter(retailer => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const retailerName = retailer.owner.toLowerCase();
        const retailerEmail = retailer.email.toLowerCase();
        const retailerPhone = retailer.phone.toLowerCase();

        if (
          !retailerName.includes(searchTerm) &&
          !retailerEmail.includes(searchTerm) &&
          !retailerPhone.includes(searchTerm)
        ) {
          return false;
        }
      }

      if (filters.status && retailer.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }

      if (filters.businessType && retailer.businessType.toLowerCase() !== filters.businessType.toLowerCase()) {
        return false;
      }

      if (filters.dateRange) {
        const registrationDate = new Date(retailer.registrationDate);
        const filterDate = new Date(filters.dateRange);
        if (registrationDate < filterDate) {
          return false;
        }
      }

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
    navigate(`/customers/${retailerId}`);
  };

  const handleEditRetailer = (retailer) => {
    setSelectedRetailer(retailer);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
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

  return (
    <div className="retailers-list-container">
          {/* Analytics Dashboard */}
          <div className="analytics-dashboard">
            <div className="analytics-card">
              <FaStore />
              <div className="analytics-info">
                <h3>Total Customers</h3>
                <p>{isLoading ? "..." : analytics.totalRetailers}</p>
              </div>
            </div>
            <div className="analytics-card">
              <FaCheckCircle />
              <div className="analytics-info">
                <h3>Active Customers</h3>
                <p>{isLoading ? "..." : analytics.activeRetailers}</p>

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
                <div className="filter-group">
                  <label>Status</label>
                  <select name="status" value={filters.status} onChange={handleFilterChange}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Order Type</label>
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
                <div className="filter-group">
                  <label>Performance</label>
                  <select name="performance" value={filters.performance} onChange={handleFilterChange}>
                    <option value="">All Performance</option>
                    <option value="high">High (&gt;90%)</option>
                    <option value="medium">Medium (80-90%)</option>
                    <option value="low">Low (&lt;80%)</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Enter location..."
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
        <Loading />
      ) : (
        <>
          {/* Edit Modal */}
          {showEditModal && selectedRetailer && (
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
                      <label>Order Type</label>
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
              <table className="retailers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Order Type</th>
                    <th>Status</th>
                    <th>Total Parcels</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredRetailers().map((retailer) => (
                    <tr key={retailer.id}>
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomersList;