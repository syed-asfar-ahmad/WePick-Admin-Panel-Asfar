import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaLock, FaUnlock, FaFilter, FaBox, FaClock, FaExclamationTriangle, FaRedo, FaSpinner } from 'react-icons/fa';
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
    search: '',
    status: '',
    location: '',
    capacity: '',
  });

  const [lockers, setLockers] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalLockers: 0
  });

  const fetchLockers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getLockers();
      
      if (response?.success) {
        const lockersData = response.data || [];
        setLockers(lockersData);
        
        // Calculate analytics
        const totalLockers = response.lockerscount || lockersData.length;
        
        setAnalytics({
          totalLockers
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
      search: '',
      status: '',
      location: '',
      capacity: '',
    });
  };

  const handleApplyFilters = () => {
    const filteredCount = getFilteredLockers().length;
    alert(`Found ${filteredCount} lockers matching your criteria`);
  };

  const getFilteredLockers = () => {
    return lockers.filter(locker => {
      if (filters.search && !locker.bname.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      if (filters.status) {
        const isAvailable = parseInt(locker.ct_new) > 0;
        const status = isAvailable ? 'available' : 'occupied';
        if (status !== filters.status.toLowerCase()) {
          return false;
        }
      }

      if (filters.location && !locker.baddr.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.capacity && locker.ct !== filters.capacity) {
        return false;
      }

      return true;
    });
  };

  const handleUnlockLocker = async (lockerId) => {
    try {
      setIsUnlocking(prev => ({ ...prev, [lockerId]: true }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLockers(prev => prev.map(locker => 
        locker.id === lockerId 
          ? { ...locker, status: 'Available' }
          : locker
      ));
    } catch (error) {
      setError(`Failed to unlock locker ${lockerId}. Please try again.`);
    } finally {
      setIsUnlocking(prev => ({ ...prev, [lockerId]: false }));
    }
  };

  

  const getStatusColor = (status) => {
    return status === 'Available' ? '#4CAF50' : '#F44336';
  };

  return (
    <div className="lockers-list-container">
      <div className="analytics-section">
        <div className="analytics-card">
          <div className="analytics-icon total">
            <FaBox />
          </div>
          <div className="analytics-info">
            <h3>Total Lockers</h3>
            <p>{isLoading ? '...' : analytics.totalLockers}</p>
          </div>
        </div>
      </div>

      <div className="page-header">
        <div className="header-content">
          <h1>Lockers Management</h1>
          <p className="subtitle">Monitor and manage your smart lockers</p>
        </div>
        <div className="header-actions">
          <button 
            className="filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />{showFilters ? 'Close Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

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
                placeholder="Search Lockers..."
              />
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
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
            <div className="filter-group">
              <label>Capacity</label>
              <select name="capacity" value={filters.capacity} onChange={handleFilterChange}>
                <option value="">All Capacities</option>
                <option value="3242">3242</option>
                <option value="10">10</option>
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

      {isLoading ? (
        <Loading />
      ) : error || lockers.length === 0 ? (
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
        <div className="lockers-table-container">
          <table className="lockers-table">
            <thead>
              <tr>
                <th>Locker UUID</th>
                <th>Building Name</th>
                <th>Building Address</th>
                <th>Building Postcode</th>
                <th>Collected Parcels Count</th>
                <th>Pending Parcels Count</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredLockers().map((locker) => {
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
      )}
    </div>
  );
};

export default LockersList;