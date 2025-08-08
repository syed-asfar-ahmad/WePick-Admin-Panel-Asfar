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

const ParcelEditModal = ({ parcel, onClose, onSave, isEditLoading = false }) => {
  const [formData, setFormData] = useState({
    // Parcel Information
    parcelName: parcel.parcelName || '',
    weight: parcel.weight || '',
    status: parcel.status || 'pending',
    
    // Sender Information
    senderName: parcel.senderName || '',
    senderInfo: {
      businessName: parcel.senderInfo?.businessName || '',
      phoneNumber: parcel.senderInfo?.phoneNumber || ''
    },
    
    // Recipient Information
    recipientName: parcel.recipientName || '',
    recipientEmail: parcel.recipientEmail || '',
    recipientPhone: parcel.recipientPhone || '',
    
    // Location Information
    from: parcel.from || '',
    to: parcel.to || '',
    
    // Timestamps (read-only)
    createdAt: parcel.createdAt || '',
    updatedAt: parcel.updatedAt || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested senderInfo fields
    if (name.startsWith('senderInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        senderInfo: {
          ...prev.senderInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare the data for saving
    const saveData = {
      ...parcel,
      ...formData,
      // Ensure senderInfo is properly structured
      senderInfo: {
        ...parcel.senderInfo,
        ...formData.senderInfo
      }
    };
    
    onSave(saveData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="parcel-edit-modal">
        <div className="modal-header">
          <div className="header-content">
            <h2>Edit Parcel</h2>
          </div>
          <button className="close-button" onClick={onClose} disabled={isEditLoading}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-grid">
            {/* Parcel Information Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaBox className="section-icon" />
                </div>
                <h3>Parcel Information</h3>
              </div>
              <div className="form-group">
                <label>
                  <FaBarcode className="input-icon" />
                  Parcel Name
                </label>
                <input
                  type="text"
                  name="parcelName"
                  value={formData.parcelName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter parcel name"
                  disabled={isEditLoading}
                />
              </div>
              <div className="form-group">
                <label>
                  <FaWeightHanging className="input-icon" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter weight in kg"
                  step="0.1"
                  disabled={isEditLoading}
                />
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
                  disabled={isEditLoading}
                >
                  <option value="pending">Pending</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="in transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Sender Information Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaUserFriends className="section-icon" />
                </div>
                <h3>Sender Information</h3>
              </div>
              <div className="form-group">
                <label>
                  <FaUserCircle className="input-icon" />
                  Sender Name
                </label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter sender name"
                  disabled={isEditLoading}
                />
              </div>
              <div className="form-group">
                <label>
                  <FaStore className="input-icon" />
                  Business Name
                </label>
                <input
                  type="text"
                  name="senderInfo.businessName"
                  value={formData.senderInfo.businessName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter business name"
                  disabled={isEditLoading}
                />
              </div>
              <div className="form-group">
                <label>
                  <FaIdCard className="input-icon" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="senderInfo.phoneNumber"
                  value={formData.senderInfo.phoneNumber}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter phone number"
                  disabled={isEditLoading}
                />
              </div>
            </div>

            {/* Recipient Information Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaUser className="section-icon" />
                </div>
                <h3>Recipient Information</h3>
              </div>
              <div className="form-group">
                <label>
                  <FaUserCircle className="input-icon" />
                  Recipient Name
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter recipient name"
                  disabled={isEditLoading}
                />
              </div>
              <div className="form-group">
                <label>
                  <FaUser className="input-icon" />
                  Email
                </label>
                <input
                  type="email"
                  name="recipientEmail"
                  value={formData.recipientEmail}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter recipient email"
                  disabled={isEditLoading}
                />
              </div>
              <div className="form-group">
                <label>
                  <FaIdCard className="input-icon" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter recipient phone"
                  disabled={isEditLoading}
                />
              </div>
            </div>

            {/* Location Information Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaWarehouse className="section-icon" />
                </div>
                <h3>Location Information</h3>
              </div>
              <div className="form-group">
                <label>
                  <FaLocationArrow className="input-icon" />
                  From
                </label>
                <input
                  type="text"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter source location"
                  disabled={isEditLoading}
                />
              </div>
              <div className="form-group">
                <label>
                  <FaLocationArrow className="input-icon" />
                  To
                </label>
                <input
                  type="text"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter destination location"
                  disabled={isEditLoading}
                />
              </div>
            </div>

            {/* Timestamps Section (Read-only) */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <FaCalendarAlt className="section-icon" />
                </div>
                <h3>Timestamps</h3>
              </div>
              <div className="form-group">
                <label>
                  <FaCalendarAlt className="input-icon" />
                  Created Date
                </label>
                <input
                  type="text"
                  name="createdAt"
                  value={formData.createdAt}
                  className="form-control"
                  readOnly
                  disabled
                />
              </div>
              <div className="form-group">
                <label>
                  <FaHistory className="input-icon" />
                  Last Updated
                </label>
                <input
                  type="text"
                  name="updatedAt"
                  value={formData.updatedAt}
                  className="form-control"
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose} disabled={isEditLoading}>
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={isEditLoading}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParcelEditModal; 