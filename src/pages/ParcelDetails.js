import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBox, FaStore, FaUser, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import './ParcelDetails.scss';

const ParcelDetails = () => {
  const { parcelId } = useParams();
  const navigate = useNavigate();

  // Mock data - In real application, this would come from an API
  const parcel = {
    id: parcelId,
    retailer: 'Tech Gadgets Store',
    customer: 'John Doe',
    date: '2024-03-15',
    status: 'In Transit',
    lockerId: 'L789',
    size: 'Medium',
    priority: 'Standard',
    trackingNumber: 'TRK123456789'
  };

  // Mock locker locations data
  const lockerLocations = [
    { id: 'L789', name: 'Downtown Hub', lat: 37.7749, lng: -122.4194, parcels: 12 },
    { id: 'L456', name: 'Westside Center', lat: 37.7833, lng: -122.4167, parcels: 8 },
    { id: 'L234', name: 'Eastside Station', lat: 37.7855, lng: -122.4067, parcels: 15 }
  ];

  // Mock tracking history data
  const trackingHistory = [
    {
      timestamp: '2024-03-17 14:30:00',
      status: 'Delivered',
      location: 'Customer Location',
      description: 'Package delivered to customer'
    },
    {
      timestamp: '2024-03-17 13:15:00',
      status: 'In Transit',
      location: 'Downtown Hub',
      description: 'Package out for delivery'
    },
    {
      timestamp: '2024-03-17 10:00:00',
      status: 'In Transit',
      location: 'Westside Center',
      description: 'Package arrived at sorting facility'
    },
    {
      timestamp: '2024-03-16 16:45:00',
      status: 'Pending',
      location: 'Eastside Station',
      description: 'Package received at locker'
    }
  ];

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered':
        return '#4CAF50';
      case 'in transit':
        return '#2196F3';
      case 'pending':
        return '#FFC107';
      case 'failed':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <div className="parcel-details-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/viewdispatchedparcels')}>
          <FaArrowLeft /> Back to Parcels
        </button>
        <h1>Parcel Details</h1>
      </div>

      <div className="parcel-info-grid">
        <div className="info-section">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <FaBox className="icon" />
              <div className="info-content">
                <label>Parcel ID</label>
                <span>{parcel.id}</span>
              </div>
            </div>
            <div className="info-item">
              <FaStore className="icon" />
              <div className="info-content">
                <label>Retailer</label>
                <span>{parcel.retailer}</span>
              </div>
            </div>
            <div className="info-item">
              <FaUser className="icon" />
              <div className="info-content">
                <label>Customer</label>
                <span>{parcel.customer}</span>
              </div>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <div className="info-content">
                <label>Current Location</label>
                <span>{lockerLocations.find(l => l.id === parcel.lockerId)?.name || parcel.lockerId}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Delivery Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-content">
                <label>Status</label>
                <span className="status-badge" style={{ backgroundColor: getStatusColor(parcel.status) }}>
                  {parcel.status}
                </span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-content">
                <label>Size</label>
                <span>{parcel.size}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-content">
                <label>Priority</label>
                <span>{parcel.priority}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-content">
                <label>Tracking Number</label>
                <span>{parcel.trackingNumber}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="info-section full-width">
          <h3>Tracking History</h3>
          <div className="tracking-timeline">
            {trackingHistory.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot" style={{ backgroundColor: getStatusColor(event.status) }}></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="status">{event.status}</span>
                    <span className="time">{event.timestamp}</span>
                  </div>
                  <div className="timeline-details">
                    <p className="location">{event.location}</p>
                    <p className="description">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelDetails; 