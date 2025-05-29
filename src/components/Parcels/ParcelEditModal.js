import React, { useState } from 'react';
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
  FaIdCard,
  FaBarcode,
  FaHistory,
  FaUserCircle,
  FaUserFriends,
  FaWarehouse,
  FaLocationArrow,
  FaRulerCombined,
  FaWeightHanging,
  FaTruckLoading,
  FaStoreAlt,
  FaClipboardCheck,
  FaEdit
} from 'react-icons/fa';
import './ParcelEditModal.scss';

const ParcelEditModal = ({ parcel, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    status: parcel.status,
    trackingNumber: parcel.trackingNumber,
    sender: parcel.sender,
    recipient: parcel.recipient,
    lockerId: parcel.lockerId,
    location: parcel.location,
    dimensions: parcel.dimensions,
    weight: parcel.weight,
    estimatedDelivery: parcel.estimatedDelivery,
    deliveryAttempts: parcel.deliveryAttempts,
    retailer: parcel.retailer
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...parcel, ...formData });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="parcel-edit-modal">
        <div className="modal-header">
          <div className="header-content">
            <h2>Edit Parcel</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-grid">
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaTruck className="section-icon" />
                </div>
                <h3>Tracking Information</h3>
              </div>
              <div className="form-group">
                <label>
                  <FaClipboardCheck className="input-icon" />
                  Status
                </label>
                <select 
                  name="status" 
                  value={formData.status}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Dispatched">Dispatched</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed">Failed</option>
                  <option value="Ready for Pickup">Ready for Pickup</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  <FaBarcode className="input-icon" />
                  Tracking Number
                </label>
                <input
                  type="text"
                  name="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaUserFriends className="section-icon" />
                </div>
                <h3>Contact Information</h3>
              </div>
              <div className="form-group">
                <label>
                  <FaUserCircle className="input-icon" />
                  Sender
                </label>
                <input
                  type="text"
                  name="sender"
                  value={formData.sender}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>
                  <FaUser className="input-icon" />
                  Recipient
                </label>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaWarehouse className="section-icon" />
                </div>
                <h3>Location Details</h3>
              </div>
              <div className="form-group">
                <label>
                  <FaIdCard className="input-icon" />
                  Locker ID
                </label>
                <input
                  type="text"
                  name="lockerId"
                  value={formData.lockerId}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>
                  <FaLocationArrow className="input-icon" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaRulerCombined className="section-icon" />
                </div>
                <h3>Parcel Specifications</h3>
              </div>
              <div className="form-group">
                <label>
                  <FaRuler className="input-icon" />
                  Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>
                  <FaWeightHanging className="input-icon" />
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaTruckLoading className="section-icon" />
                </div>
                <h3>Delivery Information</h3>
              </div>
              <div className="form-group">
                <label>
                  <FaCalendarAlt className="input-icon" />
                  Estimated Delivery
                </label>
                <input
                  type="date"
                  name="estimatedDelivery"
                  value={formData.estimatedDelivery}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>
                  <FaHistory className="input-icon" />
                  Delivery Attempts
                </label>
                <input
                  type="number"
                  name="deliveryAttempts"
                  value={formData.deliveryAttempts}
                  onChange={handleChange}
                  className="form-control"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>
                  <FaStoreAlt className="input-icon" />
                  Retailer
                </label>
                <input
                  type="text"
                  name="retailer"
                  value={formData.retailer}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParcelEditModal; 