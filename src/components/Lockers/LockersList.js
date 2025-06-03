import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaLock, FaUnlock, FaFilter, FaSearch, FaTools, FaBox, FaClock, FaExclamationTriangle, FaRedo, FaSpinner } from 'react-icons/fa';
import './LockersList.scss';

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

  // Mock data for lockers
  const mockLockers = [
    {
      id: 'L001',
      location: 'Downtown Hub',
      status: 'Available',
      lastUsed: '2024-03-15 14:30',
      size: 'Medium',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      capacity: '75%',
      busNumber: 'BUS-101'
    },
    {
      id: 'L002',
      location: 'Westside Center',
      status: 'Occupied',
      lastUsed: '2024-03-17 09:15',
      size: 'Large',
      coordinates: { lat: 37.7833, lng: -122.4167 },
      capacity: '90%',
      busNumber: 'BUS-203'
    },
    {
      id: 'L003',
      location: 'Eastside Station',
      status: 'Available',
      lastUsed: '2024-03-16 16:45',
      size: 'Small',
      coordinates: { lat: 37.7855, lng: -122.4067 },
      capacity: '60%',
      busNumber: 'BUS-305'
    },
    {
      id: 'L004',
      location: 'North Terminal',
      status: 'Occupied',
      lastUsed: '2024-03-17 11:20',
      size: 'Medium',
      coordinates: { lat: 37.7895, lng: -122.4000 },
      capacity: '85%',
      busNumber: 'BUS-402'
    },
    {
      id: 'L005',
      location: 'South Point',
      status: 'Available',
      lastUsed: '2024-03-15 13:10',
      size: 'Large',
      coordinates: { lat: 37.7800, lng: -122.4100 },
      capacity: '70%',
      busNumber: 'BUS-504'
    }
  ];

  // Simulate API call to fetch lockers
  const fetchLockers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, this would be an API call
      return mockLockers;
    } catch (err) {
      setError('Failed to load lockers. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const [lockers, setLockers] = useState([]);

  useEffect(() => {
    loadLockers();
  }, []);

  const loadLockers = async () => {
    try {
      const data = await fetchLockers();
      setLockers(data);
    } catch (err) {
      console.error('Error loading lockers:', err);
    }
  };

  // Analytics data
  const analytics = {
    totalLockers: lockers.length,
    availableLockers: lockers.filter(l => l.status === 'Available').length,
    occupiedLockers: lockers.filter(l => l.status === 'Occupied').length
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
      if (filters.search && !locker.id.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      if (filters.status && locker.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }

      if (filters.location && !locker.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.capacity && locker.size !== filters.capacity) {
        return false;
      }

      return true;
    });
  };

  const handleUnlockLocker = async (lockerId) => {
    try {
      setIsUnlocking(prev => ({ ...prev, [lockerId]: true }));
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Here you would integrate with the BlueBits API
      alert(`Unlocking locker ${lockerId} via BlueBits API`);
      // Update locker status in the list
      setLockers(prev => prev.map(locker => 
        locker.id === lockerId 
          ? { ...locker, status: 'Available' }
          : locker
      ));
    } catch (error) {
      console.error('Error unlocking locker:', error);
      setError(`Failed to unlock locker ${lockerId}. Please try again.`);
    } finally {
      setIsUnlocking(prev => ({ ...prev, [lockerId]: false }));
    }
  };

  const getStatusColor = (status) => {
    return status === 'Available' ? '#4CAF50' : '#F44336';
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <FaExclamationTriangle className="error-icon" />
          <h2>Error Loading Lockers</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={loadLockers}>
            <FaRedo /> Retry
          </button>
        </div>
      </div>
    );
  }

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
        <div className="analytics-card">
          <div className="analytics-icon available">
            <FaLock />
          </div>
          <div className="analytics-info">
            <h3>Available</h3>
            <p>{isLoading ? '...' : analytics.availableLockers}</p>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon occupied">
            <FaUnlock />
          </div>
          <div className="analytics-info">
            <h3>Occupied</h3>
            <p>{isLoading ? '...' : analytics.occupiedLockers}</p>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
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
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading lockers...</p>
        </div>
      ) : (
        <div className="lockers-table-container">
          <table className="lockers-table">
            <thead>
              <tr>
                <th>Locker ID</th>
                <th>Location</th>
                <th>Status</th>
                <th>Size</th>
                <th>Last Used</th>
                <th>Bus Number</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredLockers().map((locker) => (
                <tr key={locker.id}>
                  <td>
                    <div className="locker-id">
                      <span>{locker.id}</span>
                    </div>
                  </td>
                  <td>
                    <div className="location-cell">
                      <FaMapMarkerAlt className="icon" />
                      <span>{locker.location}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(locker.status) }}
                    >
                      {locker.status}
                    </span>
                  </td>
                  <td>
                    <span className="size-badge">{locker.size}</span>
                  </td>
                  <td>
                    <div className="time-cell">
                      <FaClock className="icon" />
                      <span>{locker.lastUsed}</span>
                    </div>
                  </td>
                  <td>
                    <div className="bus-number">
                      <span className="bus-badge">{locker.busNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div className="capacity-cell">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: locker.capacity,
                            backgroundColor: locker.capacity > '80%' ? '#4CAF50' : '#FFC107'
                          }}
                        />
                      </div>
                      <span className="capacity-text">{locker.capacity}</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      className={`unlock-button ${isUnlocking[locker.id] ? 'loading' : ''}`}
                      onClick={() => handleUnlockLocker(locker.id)}
                      disabled={locker.status === 'Available' || isUnlocking[locker.id]}
                    >
                      {isUnlocking[locker.id] ? (
                        <div className="button-spinner"></div>
                      ) : (
                        <>
                          {locker.status === 'Available' ? <FaLock /> : <FaUnlock />}
                          {locker.status === 'Available' ? 'Locked' : 'Unlock'}
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LockersList; 