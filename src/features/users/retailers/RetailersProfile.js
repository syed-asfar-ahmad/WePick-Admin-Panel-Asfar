import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStore, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard, FaBox, FaTruck, FaStar, FaFileAlt, FaEdit, FaCheckCircle, FaTimesCircle, FaUser, FaCamera } from 'react-icons/fa';
import Loading from '../../../components/common/Loading';
import './RetailersProfile.scss';
import { getRetailerById, updateRetailerById } from '../../../services/wepickApi';

const RetailersProfile = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    owner: '',
    businessEmail: '',
    businessAddress: '',
    phone: '',
    profileImage: null
  });
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
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
          storeName: retailer.businessName || '',
          owner: retailer.name || '',
          businessEmail: retailer.businessEmail || '',
          businessAddress: retailer.businessAddress || '',
          phone: retailer.phoneNumber || '',
          profileImage: null // If you have image URL, set it here
        });
      } catch (err) {
        setError('Failed to load retailer profile.');
      } finally {
        setLoading(false);
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          setInitialLoadComplete(true);
        }, 500);
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

  const handleSave = async () => {
    try {
      setIsEditing(false);
      // Make API call to update retailer data
      await updateRetailerById(id, {
        businessName: formData.storeName,
        name: formData.owner,
        businessEmail: formData.businessEmail,
        businessAddress: formData.businessAddress,
        phoneNumber: formData.phone
      });
      
      // Re-fetch the data to show updated information
      const response = await getRetailerById(id);
      const retailer = response.data || {};
      setFormData({
        storeName: retailer.businessName || '',
        owner: retailer.name || '',
        businessEmail: retailer.businessEmail || '',
        businessAddress: retailer.businessAddress || '',
        phone: retailer.phoneNumber || '',
        profileImage: null
      });
      
      // Show success message or handle errors
    } catch (err) {
      setError('Failed to update retailer. Please try again.');
    }
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

  if (loading || !initialLoadComplete) {
    return <Loading />;
  }
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-profile-container">
      <div className="profile-header">
        <div className="header-left">
          <h1>Retailer Profile</h1>
          {/* You can add status badge if available in API */}
        </div>
                 <div className="edit-buttons">
           {isEditing && (
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
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
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
                  <p><FaPhone /> {formData.phone}</p>
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