import React, { useState, useEffect } from 'react';
import { FaFilter, FaBox, FaCheckCircle, FaChartBar, FaTimes, FaSpinner, FaFileAlt, FaChartLine } from 'react-icons/fa';
import ParcelViewModal from './ParcelViewModal';
import ParcelEditModal from './ParcelEditModal';
import './ParcelsList.scss';
import Loading from '../../components/common/Loading';
import { getParcelSummary, getParcelReport, getParcelDetail, getParcels, updateParcel } from '../../services/wepickApi';

const ParcelsList = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [editingParcel, setEditingParcel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parcelSummary, setParcelSummary] = useState(null);
  const [parcelReport, setParcelReport] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    lockerId: '',
    dateRange: '',
    retailer: '',
    location: ''
  });

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalParcels: 0,
    activeParcels: 0,
    deliveredParcels: 0,
    averageDeliveryTime: '0 hours',
    topPerformingLockers: []
  });

  // Parcels data
  const [parcels, setParcels] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

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
      lockerId: '',
      dateRange: '',
      retailer: '',
      location: ''
    });
  };

  const fetchParcelsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getParcels();
      
      if (response?.success) {
        const parcelsData = response.data?.parcels || [];
        setParcels(parcelsData);
        
        // Update pagination
        setPagination({
          currentPage: response.data?.currentPage || 1,
          totalPages: response.data?.totalPages || 1,
          totalCount: response.data?.totalParcelCount || 0
        });
        
        // Update analytics
        setAnalytics({
          totalParcels: response.data?.totalParcelCount || 0,
          activeParcels: 0,
          deliveredParcels: 0,
          averageDeliveryTime: '2.5 hours',
          topPerformingLockers: []
        });
      } else {
        setError('Failed to load parcels. Please try again.');
        setParcels([]);
      }
    } catch (err) {
      setError('Failed to load parcels. Please try again.');
      setParcels([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParcelsData();
  }, []);

  const handleApplyFilters = () => {
    const filteredCount = getFilteredParcels().length;
    alert(`Found ${filteredCount} parcels matching your criteria`);
  };

  const getFilteredParcels = () => {
    return parcels.filter(parcel => {
      if (filters.search && !parcel.parcelId.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      if (filters.status && parcel.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }

      if (filters.retailer && !parcel.businessName.toLowerCase().includes(filters.retailer.toLowerCase())) {
        return false;
      }

      if (filters.location && !parcel.to.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.dateRange) {
        const parcelDate = parcel.createdDate;
        if (parcelDate !== filters.dateRange) {
          return false;
        }
      }

      return true;
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Dispatched': '#4CAF50',
      'In Transit': '#2196F3',
      'Delivered': '#4CAF50',
      'Failed': '#F44336',
      'Ready for Pickup': '#FF9800'
    };
    return colors[status] || '#666';
  };

  const handleViewParcel = async (parcel) => {
    try {
      setIsLoading(true);
      const response = await getParcelDetail(parcel.id);
      if (response?.data) {
        setSelectedParcel(response.data);
      }
    } catch (err) {
      setError('Failed to load parcel details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditParcel = async (parcel) => {
    try {
      setIsLoading(true);
      const response = await getParcelDetail(parcel.id);
      if (response?.data) {
        setEditingParcel(response.data);
      } else {
        // Fallback to basic parcel data if API call fails
        setEditingParcel(parcel);
      }
    } catch (err) {
      console.error('Failed to load parcel details for editing:', err);
      // Fallback to basic parcel data if API call fails
      setEditingParcel(parcel);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveParcel = async (updatedParcel) => {
    try {
      setIsLoading(true);
      
      // Make API call to update parcel
      const response = await updateParcel(updatedParcel.id, updatedParcel);
      
      if (response?.success) {
        setEditingParcel(null);
        
        // If the updated parcel is currently being viewed, refresh its data
        if (selectedParcel && selectedParcel.id === updatedParcel.id) {
          try {
            const detailResponse = await getParcelDetail(updatedParcel.id);
            if (detailResponse?.data) {
              setSelectedParcel(detailResponse.data);
            }
          } catch (err) {
            console.error('Failed to refresh selected parcel data:', err);
          }
        }
        
        // Refresh the parcels list to show updated data
        fetchParcelsData();
      } else {
        throw new Error('Failed to update parcel');
      }
    } catch (err) {
      console.error('❌ Failed to save parcel:', err);
      setError('Failed to save parcel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="parcels-list-container">
      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <div className="analytics-card">
          <FaBox />
          <div className="analytics-info">
            <h3>Total Parcels</h3>
            <p>{isLoading ? "..." : analytics.totalParcels}</p>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <h1>Parcels Management</h1>
        <div className="header-actions">
          <button 
            className="filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            {showFilters ? 'Close Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Filters Section */}
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
                placeholder="Search by Parcel ID"
              />
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Business Name</label>
              <input
                type="text"
                name="retailer"
                value={filters.retailer}
                onChange={handleFilterChange}
                placeholder="Enter Business Name"
              />
            </div>
            <div className="filter-group">
              <label>Destination</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter Destination"
              />
            </div>
            <div className="filter-group">
              <label>Date</label>
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

      {/* Table View */}
      <div className="view-content">
        <div className="table-container">
          {isLoading ? (
            <>
             <Loading /> 
            </>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button 
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <table className="parcels-table">
              <thead>
                <tr>
                  <th>Parcel ID</th>
                  <th>Status</th>
                  <th>Sender Name</th>
                  <th>Recipient Name</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Created Date</th>
                  <th>Weight</th>
                  <th>Business Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredParcels().map((parcel) => (
                  <tr key={parcel.id}>
                    <td className="parcel-cell">
                      <div className="icon-text">
                        <FaBox className="parcel-icon" style={{ color: '#4CAF50' }} />
                        <span>{parcel.parcelId}</span>
                      </div>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(parcel.status) }}
                      >
                        {parcel.status}
                      </span>
                    </td>
                    <td>{parcel.senderName || 'N/A'}</td>
                    <td>{parcel.recipientName || 'N/A'}</td>
                    <td>{parcel.from}</td>
                    <td>{parcel.to}</td>
                    <td>{parcel.createdDate}</td>
                    <td>{parcel.weight}</td>
                    <td>{parcel.businessName || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-button view"
                          onClick={() => handleViewParcel(parcel)}
                        >
                          View
                        </button>
                        <button 
                          className="action-button edit" 
                          onClick={() => handleEditParcel(parcel)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Parcel View Modal */}
      {selectedParcel && (
        <ParcelViewModal
          parcel={selectedParcel}
          onClose={() => setSelectedParcel(null)}
        />
      )}

      {editingParcel && (
        <ParcelEditModal
          parcel={editingParcel}
          onClose={() => setEditingParcel(null)}
          onSave={handleSaveParcel}
        />
      )}
    </div>
  );
};

export default ParcelsList; 