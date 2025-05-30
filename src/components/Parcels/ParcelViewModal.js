import React from 'react';
import { 
  FaTimes, 
  FaBox, 
  FaUser, 
  FaMapMarkerAlt, 
  FaTruck, 
  FaCalendarAlt, 
  FaWeight, 
  FaRuler, 
  FaStore, 
  FaHistory,
  FaIdCard,
  FaBarcode,
  FaUserCircle,
  FaUserFriends,
  FaWarehouse,
  FaLocationArrow,
  FaRulerCombined,
  FaWeightHanging,
  FaTruckLoading,
  FaStoreAlt,
  FaClipboardCheck
} from 'react-icons/fa';
import './ParcelViewModal.scss';

const ParcelViewModal = ({ parcel, onClose }) => {
  if (!parcel) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Dispatched':
        return '#4CAF50';
      case 'In Transit':
        return '#2196F3';
      case 'Delivered':
        return '#4CAF50';
      case 'Failed':
        return '#F44336';
      case 'Ready for Pickup':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="parcel-view-modal">
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon-wrapper">
              <FaBox className="header-icon" />
            </div>
            <h2>Parcel Details</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          <div className="parcel-status">
            <div className="status-container">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(parcel.status) }}
              >
                {parcel.status}
              </span>
              <div className="status-info">
                <p className="status-label">Current Status</p>
                <p className="last-update">Last updated: {parcel.lastUpdate}</p>
              </div>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-section tracking-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaTruck className="section-icon" />
                </div>
                <h3>Tracking Information</h3>
              </div>
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <FaBox className="info-icon" />
                </div>
                <div className="info-content">
                  <label>Parcel ID</label>
                  <p>{parcel.id}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <FaBarcode className="info-icon" />
                </div>
                <div className="info-content">
                  <label>Tracking Number</label>
                  <p className="tracking-number">{parcel.trackingNumber}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <FaCalendarAlt className="info-icon" />
                </div>
                <div className="info-content">
                  <label>Created Date</label>
                  <p>{parcel.createdAt}</p>
                </div>
              </div>
            </div>

            <div className="info-section contact-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaUserFriends className="section-icon" />
                </div>
                <h3>Contact Information</h3>
              </div>
              <div className="contact-grid">
                <div className="contact-card sender">
                  <div className="contact-icon-wrapper">
                    <FaUserCircle className="contact-icon" />
                  </div>
                  <h4>Sender</h4>
                  <p>{parcel.sender}</p>
                </div>
                <div className="contact-card recipient">
                  <div className="contact-icon-wrapper">
                    <FaUser className="contact-icon" />
                  </div>
                  <h4>Recipient</h4>
                  <p>{parcel.recipient}</p>
                </div>
              </div>
            </div>

            <div className="info-section location-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaWarehouse className="section-icon" />
                </div>
                <h3>Location Details</h3>
              </div>
              <div className="location-card">
                <div className="location-info">
                  <div className="info-item">
                    <div className="info-icon-wrapper">
                      <FaIdCard className="info-icon" />
                    </div>
                    <div>
                      <label>Locker ID</label>
                      <p>{parcel.lockerId}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon-wrapper">
                      <FaLocationArrow className="info-icon" />
                    </div>
                    <div>
                      <label>Location</label>
                      <p>{parcel.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-section specs-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaRulerCombined className="section-icon" />
                </div>
                <h3>Parcel Specifications</h3>
              </div>
              <div className="specs-grid">
                <div className="spec-card">
                  <div className="spec-icon-wrapper">
                    <FaRuler className="spec-icon" />
                  </div>
                  <div>
                    <label>Dimensions</label>
                    <p>{parcel.dimensions}</p>
                  </div>
                </div>
                <div className="spec-card">
                  <div className="spec-icon-wrapper">
                    <FaWeightHanging className="spec-icon" />
                  </div>
                  <div>
                    <label>Weight</label>
                    <p>{parcel.weight}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="delivery-info">
            <div className="section-header">
              <div className="section-icon-wrapper">
                <FaTruckLoading className="section-icon" />
              </div>
              <h3>Delivery Information</h3>
            </div>
            <div className="delivery-grid">
              <div className="delivery-card">
                <div className="delivery-icon-wrapper">
                  <FaCalendarAlt className="delivery-icon" />
                </div>
                <div>
                  <label>Estimated Delivery</label>
                  <p>{parcel.estimatedDelivery}</p>
                </div>
              </div>
              <div className="delivery-card">
                <div className="delivery-icon-wrapper">
                  <FaHistory className="delivery-icon" />
                </div>
                <div>
                  <label>Delivery Attempts</label>
                  <p>{parcel.deliveryAttempts}</p>
                </div>
              </div>
              <div className="delivery-card">
                <div className="delivery-icon-wrapper">
                  <FaStoreAlt className="delivery-icon" />
                </div>
                <div>
                  <label>Retailer</label>
                  <p>{parcel.retailer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelViewModal; 