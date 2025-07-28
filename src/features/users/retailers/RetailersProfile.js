import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStore, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard, FaBox, FaTruck, FaStar, FaFileAlt, FaEdit, FaCheckCircle, FaTimesCircle, FaUser, FaCamera } from 'react-icons/fa';
import './RetailersProfile.scss';
import { getRetailerById } from '../../../services/wepickApi';

const RetailersProfile = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    owner: '',
    businessEmail: '',
    businessAddress: '',
    businessRegistrationNumber: '',
    totalParcels: 0,
    profileImage: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRetailerData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getRetailerById(id);
        // API response: { success, message, data: { ...retailer } }
        const retailer = response.data || {};
        setFormData({
          storeName: retailer.storeName || '',
          owner: retailer.owner || '',
          businessEmail: retailer.businessEmail || '',
          businessAddress: retailer.businessAddress || '',
          businessRegistrationNumber: retailer.businessRegistrationNumber || '',
          totalParcels: retailer.totalParcels || 0,
          profileImage: null // If you have image URL, set it here
        });
      } catch (err) {
        setError('Failed to load retailer profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchRetailerData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the changes
    console.log('Saving changes:', formData);
    setIsEditing(false);
    // Show success message or handle errors
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally, re-fetch data to reset form
  };

  const renderProfileImage = () => {
    if (formData.profileImage) {
      return (
        <img 
          src={formData.profileImage} 
          alt={formData.storeName}
          className="profile-image"
        />
      );
    }
    return (
      <div className="user-icon">
        <FaUser />
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="view-profile-container">
      <div className="profile-header">
        <div className="header-left">
          <h1>Retailer Profile</h1>
          {/* You can add status badge if available in API */}
        </div>
        <div className="edit-buttons">
          {isEditing ? (
            <>
              <button 
                className="edit-button save"
                onClick={handleSave}
              >
                <FaCheckCircle /> Save Changes
              </button>
              <button 
                className="edit-button cancel"
                onClick={handleCancel}
              >
                <FaTimesCircle /> Cancel
              </button>
            </>
          ) : (
            <button 
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card main-info">
          <div className="store-image">
            {renderProfileImage()}
            {isEditing && (
              <label className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <FaCamera />
              </label>
            )}
          </div>
          <div className="store-details">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Owner</label>
                  <input
                    type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="businessEmail"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Business Registration Number</label>
                  <input
                    type="text"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ) : (
              <>
                <h2><FaStore /> {formData.storeName}</h2>
                <p className="owner-name">Owner: {formData.owner}</p>
                <div className="contact-info">
                  <p><FaEnvelope /> {formData.businessEmail}</p>
                  <p><FaMapMarkerAlt /> {formData.businessAddress}</p>
                  <p>Total Parcels: {formData.totalParcels}</p>
                  <p>Business Registration #: {formData.businessRegistrationNumber}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailersProfile; 