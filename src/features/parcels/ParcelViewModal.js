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
    switch(status.toLowerCase()) {
      case 'delivered':
        return '#4CAF50';
      case 'in transit':
        return '#2196F3';
      case 'pending':
        return '#FFC107';
      case 'failed':
        return '#F44336';
      case 'dispatched':
        return '#4CAF50';
      case 'ready for pickup':
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
                <p className="last-update">Last updated: {parcel.updatedAt || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-section tracking-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaTruck className="section-icon" />
                </div>
                <h3>Parcel Information</h3>
              </div>
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <FaBox className="info-icon" />
                </div>
                <div className="info-content">
                  <label>Parcel ID</label>
                  <p>{parcel.parcelId || 'N/A'}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <FaBarcode className="info-icon" />
                </div>
                <div className="info-content">
                  <label>Parcel Name</label>
                  <p>{parcel.parcelName || 'N/A'}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <FaCalendarAlt className="info-icon" />
                </div>
                <div className="info-content">
                  <label>Created Date</label>
                  <p>{parcel.createdAt || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="info-section contact-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaUserFriends className="section-icon" />
                </div>
                <h3>Sender Information</h3>
              </div>
              <div className="contact-details">
                <div className="detail-row">
                  <div className="detail-label">
                    <FaUserCircle className="detail-icon" />
                    <span>Name</span>
                  </div>
                  <div className="detail-value">{parcel.senderName || 'N/A'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">
                    <FaStore className="detail-icon" />
                    <span>Business</span>
                  </div>
                  <div className="detail-value">{parcel.senderInfo?.businessName || 'N/A'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">
                    <FaIdCard className="detail-icon" />
                    <span>Phone</span>
                  </div>
                  <div className="detail-value">{parcel.senderInfo?.phoneNumber || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="info-section contact-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaUser className="section-icon" />
                </div>
                <h3>Recipient Information</h3>
              </div>
              <div className="contact-details">
                <div className="detail-row">
                  <div className="detail-label">
                    <FaUserCircle className="detail-icon" />
                    <span>Name</span>
                  </div>
                  <div className="detail-value">{parcel.recipientName || 'N/A'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">
                    <FaUser className="detail-icon" />
                    <span>Email</span>
                  </div>
                  <div className="detail-value">{parcel.recipientEmail || 'N/A'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">
                    <FaIdCard className="detail-icon" />
                    <span>Phone</span>
                  </div>
                  <div className="detail-value">{parcel.recipientPhone || 'N/A'}</div>
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
                      <FaLocationArrow className="info-icon" />
                    </div>
                    <div>
                      <label>From</label>
                      <p>{parcel.from || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon-wrapper">
                      <FaLocationArrow className="info-icon" />
                    </div>
                    <div>
                      <label>To</label>
                      <p>{parcel.to || 'N/A'}</p>
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
                    <FaWeightHanging className="spec-icon" />
                  </div>
                  <div>
                    <label>Weight</label>
                    <p>{parcel.weight ? `${parcel.weight}kg` : '-'}</p>
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
              <h3>Timeline Information</h3>
            </div>
            <div className="delivery-grid">
              <div className="delivery-card">
                <div className="delivery-icon-wrapper">
                  <FaCalendarAlt className="delivery-icon" />
                </div>
                <div className="delivery-content">
                  <label>Created Date</label>
                  <p>{parcel.createdAt || 'N/A'}</p>
                </div>
              </div>
              <div className="delivery-card">
                <div className="delivery-icon-wrapper">
                  <FaHistory className="delivery-icon" />
                </div>
                <div className="delivery-content">
                  <label>Last Updated</label>
                  <p>{parcel.updatedAt || 'N/A'}</p>
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