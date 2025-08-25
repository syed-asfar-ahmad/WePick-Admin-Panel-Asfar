import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaLock, FaUnlock, FaFilter, FaBox, FaClock, FaExclamationTriangle, FaRedo, FaSpinner, FaSearch, FaTimes } from 'react-icons/fa';
import './LockersList.scss';
import Loading from '../../components/common/Loading';
import { getLockers } from '../../services/wepickApi';


const LockersList = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnlocking, setIsUnlocking] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    size: '',
  });

  const [lockers, setLockers] = useState([]);
  const [compartments, setCompartments] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalLockers: 0,
    totalCompartments: 0,
    availableCompartments: 0,
    occupiedCompartments: 0
  });
  
     // Pagination state
   const [currentPage, setCurrentPage] = useState(1);
   const [lockersCurrentPage, setLockersCurrentPage] = useState(1);
   const [compartmentsCurrentPage, setCompartmentsCurrentPage] = useState(1);
   const [itemsPerPage] = useState(10);

  const fetchLockers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getLockers();
      
      if (response?.success) {
        // Extract lockers and compartments from the nested structure
        const lockersData = response.data?.lockers || [];
        const compartmentsData = response.data?.compartments || [];
        
        setLockers(lockersData);
        setCompartments(compartmentsData);
        
        // Calculate analytics
        const totalLockers = response.lockerscount || lockersData.length;
        const totalCompartments = compartmentsData.length;
        const availableCompartments = compartmentsData.filter(comp => comp.status === "0").length;
        const occupiedCompartments = compartmentsData.filter(comp => comp.status === "1").length;
        
        setAnalytics({
          totalLockers,
          totalCompartments,
          availableCompartments,
          occupiedCompartments
        });
      } else {
        setError('Failed to load lockers. Please try again.');
        setLockers([]);
      }
    } catch (err) {
      setError('Failed to load lockers. Please try again.');
      setLockers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])


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
      size: '',
    });
  };

  const handleApplyFilters = () => {
    const filteredCount = getFilteredLockers().length;
    alert(`Found ${filteredCount} lockers matching your criteria`);
  };

  const getFilteredLockers = () => {
    // Ensure lockers is an array before filtering
    if (!Array.isArray(lockers)) {
      return [];
    }
    
    // Status filter removed from lockers - show all lockers
    return lockers;
  };

  const handleUnlockLocker = async (lockerId) => {
    try {
      setIsUnlocking(prev => ({ ...prev, [lockerId]: true }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLockers(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.map(locker => 
          locker.id === lockerId 
            ? { ...locker, status: 'Available' }
            : locker
        );
      });
    } catch (error) {
      setError(`Failed to unlock locker ${lockerId}. Please try again.`);
    } finally {
      setIsUnlocking(prev => ({ ...prev, [lockerId]: false }));
    }
  };

  

  const getStatusColor = (status) => {
    return status === 'Available' ? '#4CAF50' : '#F44336';
  };

  const getSizeDescription = (size) => {
    switch (size) {
      case '2':
        return 'Small';
      case '3':
        return 'Medium';
      case '4':
        return 'Large';
      default:
        return size;
    }
  };

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination functions
  const filteredLockers = getFilteredLockers();
  
  // Apply filters to compartments
  const filteredCompartments = compartments.filter(comp => {
    // Skip system compartments
    if (comp.alias === 'sys') return false;
    
    // Apply status filter
    if (filters.status) {
      const isAvailable = comp.status === "0";
      const status = isAvailable ? 'available' : 'occupied';
      if (status !== filters.status.toLowerCase()) {
        return false;
      }
    }
    
    // Apply size filter
    if (filters.size && getSizeDescription(comp.size) !== filters.size) {
      return false;
    }
    
    return true;
  });
  
  // Apply search filter
  const searchFilteredLockers = filteredLockers.filter(locker => 
    locker.bname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    locker.baddr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    locker.buid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    locker.bpost.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const searchFilteredCompartments = filteredCompartments.filter(comp => 
    comp.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.cid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSizeDescription(comp.size).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
           // Separate pagination for lockers
    const lockersIndexOfLastItem = lockersCurrentPage * itemsPerPage;
    const lockersIndexOfFirstItem = lockersIndexOfLastItem - itemsPerPage;
    const currentLockers = searchFilteredLockers.slice(lockersIndexOfFirstItem, lockersIndexOfLastItem);
    const totalLockers = searchFilteredLockers.length;
    const totalLockersPages = Math.ceil(totalLockers / itemsPerPage);
    
    // Separate pagination for compartments
    const compartmentsIndexOfLastItem = compartmentsCurrentPage * itemsPerPage;
    const compartmentsIndexOfFirstItem = compartmentsIndexOfLastItem - itemsPerPage;
    const currentCompartments = searchFilteredCompartments.slice(compartmentsIndexOfFirstItem, compartmentsIndexOfLastItem);
    const totalCompartments = searchFilteredCompartments.length;
    const totalCompartmentsPages = Math.ceil(totalCompartments / itemsPerPage);

     const handleLockersPageChange = (pageNumber) => {
     setLockersCurrentPage(pageNumber);
   };
   
   const handleCompartmentsPageChange = (pageNumber) => {
     setCompartmentsCurrentPage(pageNumber);
   };

           return (
        <div className="retailers-list-container">
          {/* Analytics Dashboard */}
          <div className="analytics-dashboard">
            <div className="analytics-card">
              <FaBox />
              <div className="analytics-info">
                <h3>Total Lockers</h3>
                <p>{isLoading ? "..." : analytics.totalLockers}</p>
              </div>
            </div>
          </div>

                                                       <div className="page-header">
              <h1>Locker Management</h1>
              <button 
                className="filter-button"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter />{showFilters ? 'Close Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Filters Section - Now above search bar */}
            {showFilters && (
              <div className={`filters-section ${showFilters ? 'show' : 'hide'}`}>
                <div className="filters-grid">
                  <div className="filter-group">
                    <label>Status</label>
                    <select name="status" value={filters.status} onChange={handleFilterChange}>
                      <option value="">All Status</option>
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Size</label>
                    <select name="size" value={filters.size} onChange={handleFilterChange}>
                      <option value="">All Sizes</option>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </select>
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

            {/* Search Filter - Now below filters */}
            <div className="search-filter-container">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                                 <input
                   type="text"
                   placeholder="Search Lockers & Compartments"
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
                  <span>Found {totalLockers} lockers and {totalCompartments} compartments</span>
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
      ) : error || !Array.isArray(lockers) || lockers.length === 0 ? (
        <div className="no-data-container">
          <div className="no-data-content">
            {/* <FaExclamationTriangle className="error-icon" /> */}
            <p className="error-message">{error || 'No lockers available'}</p>
            <button className="retry-button" onClick={fetchLockers}>
              {/* <FaRedo /> */}
              Retry
            </button>
          </div>
        </div>
             ) : (
                   <>
                                       {/* Locker Information and Compartments Details Table */}
              <div className="lockers-table-container">
                <h2>Locker Information</h2>
                <div className="table-container">
                  <table className="lockers-table">
                  <thead>
                    <tr>
                      <th>Locker UUID</th>
                      <th>Building Name</th>
                      <th>Building Address</th>
                      <th>Building Postcode</th>
                      <th>Collected Parcels</th>
                      <th>Pending Parcels</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLockers.map((locker) => {
                      const isAvailable = parseInt(locker.ct_new) > 0;
                      const status = isAvailable ? 'Available' : 'Occupied';
                      return (
                        <tr key={locker.buid}>
                          <td>
                            <div className="locker-id">
                              <span>{locker.buid}</span>
                            </div>
                          </td>
                          <td>
                            <div className="building-name">
                              <span>{locker.bname}</span>
                            </div>
                          </td>
                          <td>
                            <div className="location-cell">
                              <span>{locker.baddr}</span>
                            </div>
                          </td>
                          <td>
                            <span className="postal-code">{locker.bpost}</span>
                          </td>
                          <td>
                            <span className="total-capacity">{locker.ct}</span>
                          </td>
                          <td>
                            <div className="available-capacity">
                              <span className="capacity-badge">{locker.ct_new}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>

                <h2>Compartments Details</h2>
                <div className="table-container">
                  <table className="lockers-table">
                  <thead>
                    <tr>
                      <th>Compartment ID</th>
                      <th>Compartment Number</th>
                      <th>Size</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCompartments.map((compartment) => {
                      const isAvailable = compartment.status === "0";
                      const status = isAvailable ? 'Available' : 'Occupied';
                      return (
                        <tr key={compartment.id}>
                          <td>
                            <div className="compartment-id">
                              <span>{compartment.cid}</span>
                            </div>
                          </td>
                          <td>
                            <span className="alias">{compartment.alias}</span>
                          </td>
                          <td>
                            <span className="size">{getSizeDescription(compartment.size)}</span>
                          </td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{ 
                                backgroundColor: isAvailable ? '#4CAF50' : '#F44336',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </div>

             {/* Compartments Details Pagination - Outside container */}
             {totalCompartments > 0 && (
               <div className="pagination-container">
                 <div className="pagination-info">
                   Showing {((compartmentsCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(compartmentsCurrentPage * itemsPerPage, totalCompartments)} of {totalCompartments} compartments (Page {compartmentsCurrentPage} of {totalCompartmentsPages})
                 </div>
                 <div className="pagination-controls">
                   <button 
                     className="pagination-btn prev-btn"
                     onClick={() => handleCompartmentsPageChange(compartmentsCurrentPage - 1)}
                     disabled={compartmentsCurrentPage === 1}
                   >
                     <span>←</span> Previous
                   </button>
                   <div className="page-numbers">
                     {compartmentsCurrentPage > 2 && (
                       <button 
                         className="pagination-btn page-btn"
                         onClick={() => handleCompartmentsPageChange(1)}
                       >
                         1
                       </button>
                     )}
                     {compartmentsCurrentPage > 3 && <span className="page-dots">...</span>}
                     {compartmentsCurrentPage > 1 && (
                       <button 
                         className="pagination-btn page-btn"
                         onClick={() => handleCompartmentsPageChange(compartmentsCurrentPage - 1)}
                       >
                         {compartmentsCurrentPage - 1}
                       </button>
                     )}
                     <button 
                       className="pagination-btn page-btn active"
                       disabled
                     >
                       {compartmentsCurrentPage}
                     </button>
                     {compartmentsCurrentPage < totalCompartmentsPages && (
                       <button 
                         className="pagination-btn page-btn"
                         onClick={() => handleCompartmentsPageChange(compartmentsCurrentPage + 1)}
                       >
                         {compartmentsCurrentPage + 1}
                       </button>
                     )}
                     {compartmentsCurrentPage < totalCompartmentsPages - 2 && <span className="page-dots">...</span>}
                     {compartmentsCurrentPage < totalCompartmentsPages - 1 && (
                       <button 
                         className="pagination-btn page-btn"
                         onClick={() => handleCompartmentsPageChange(totalCompartmentsPages)}
                       >
                         {totalCompartmentsPages}
                       </button>
                     )}
                   </div>
                   <button 
                     className="pagination-btn next-btn"
                     onClick={() => handleCompartmentsPageChange(compartmentsCurrentPage + 1)}
                     disabled={compartmentsCurrentPage === totalCompartmentsPages}
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

export default LockersList;