import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaEnvelope, FaUser, FaPhone } from 'react-icons/fa';
import Loading from '../../../components/common/Loading';
import './CustomersProfile.scss';
import { getCustomerById } from '../../../services/wepickApi';

const CustomersProfile = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    totalParcels: 0,
    profileImage: null
  });
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCustomerById(id);
        const customer = response.data || {};
        
        setFormData({
          name: customer.name || customer.recipient?.name || '',
          email: customer.email || customer.recipient?.email || '',
          phoneNumber: customer.phoneNumber || customer.recipient?.phone || '',
          totalParcels: customer.totalParcels || 0,
          profileImage: null
        });
      } catch (err) {
        setError('Failed to load customer profile.');
      } finally {
        setLoading(false);
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          setInitialLoadComplete(true);
        }, 500);
      }
    };
    fetchCustomerData();
  }, [id]);

  const renderProfileImage = () => {
    if (formData.profileImage) {
      return (
        <img 
          src={formData.profileImage} 
          alt={formData.name}
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
          <h1>Customer Profile</h1>
        </div>
      </div>
      
      <div className="profile-grid">
        <div className="profile-card main-info">
          <div className="store-image">
            {renderProfileImage()}
          </div>
          <div className="store-details">
            <h2>{formData.name}</h2>
            <div className="contact-info">
              <p><FaEnvelope /> {formData.email}</p>
              <p><FaPhone /> {formData.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersProfile; 