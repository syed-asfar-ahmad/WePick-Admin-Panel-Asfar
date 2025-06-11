import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStore, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard, FaBox, FaTruck, FaStar, FaFileAlt, FaEdit, FaCheckCircle, FaTimesCircle, FaUser, FaCamera } from 'react-icons/fa';
import './CustomersProfile.scss';

const CustomersProfile = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    businessLicense: '',
    profileImage: null
  });

  // Mock data - In real application, this would come from an API
  const retailerData = {
    status: 'Active',
    recentActivity: [
      { type: 'delivery', status: 'completed', date: '2024-03-15', details: 'Parcel #12345 received successfully' },
      { type: 'pickup', status: 'pending', date: '2024-03-14', details: 'New order request for Parcel #12346' },
      { type: 'delivery', status: 'failed', date: '2024-03-13', details: 'Failed order attempt for Parcel #12344' }
    ],
    documents: [
      { name: 'Order Invoices', url: '#', status: 'verified' },
      { name: 'Membership Card', url: '#', status: 'verified' },
      { name: 'Return Policy', url: '#', status: 'pending' }
    ]
  };

  useEffect(() => {
    // In a real application, fetch retailer data based on ID
    const fetchRetailerData = async () => {
      try {
        // Replace this with your actual API call
        // const response = await fetch(`/api/retailers/${id}`);
        // const data = await response.json();
        
        // For now, using mock data based on ID
        const mockData = {
          '1': {
            storeName: 'Tech Gadgets Store',
            ownerName: 'John Smith',
            email: 'john.smith@techgadgets.com',
            phone: '+1 234 567 8900',
            address: '123 Tech Street, Silicon Valley, CA 94043',
            businessLicense: 'BL-2023-001'
          },
          '2': {
            storeName: 'Fashion Boutique',
            ownerName: 'Sarah Johnson',
            email: 'sarah@fashionboutique.com',
            phone: '+1 234 567 8901',
            address: '456 Fashion Ave, New York, NY 10001',
            businessLicense: 'BL-2023-002'
          },
          '3': {
            storeName: 'Home Essentials',
            ownerName: 'Mike Brown',
            email: 'mike@homeessentials.com',
            phone: '+1 234 567 8902',
            address: '789 Home St, Chicago, IL 60601',
            businessLicense: 'BL-2023-003'
          },
          '4': {
            storeName: 'Gourmet Delights',
            ownerName: 'Emma Wilson',
            email: 'emma@gourmetdelights.com',
            phone: '+1 234 567 8903',
            address: '321 Food Court, San Francisco, CA 94105',
            businessLicense: 'BL-2023-004'
          },
          '5': {
            storeName: 'Sports & Fitness',
            ownerName: 'David Chen',
            email: 'david@sportsfitness.com',
            phone: '+1 234 567 8904',
            address: '555 Athletic Blvd, Boston, MA 02108',
            businessLicense: 'BL-2023-005'
          }
        };

        const storeData = mockData[id] || mockData['1']; // Fallback to first store if ID not found
        setFormData({
          ...storeData,
          profileImage: null
        });
      } catch (error) {
        console.error('Error fetching retailer data:', error);
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
    // Reset form data to original values
    const fetchRetailerData = async () => {
      try {
        // Replace this with your actual API call
        // const response = await fetch(`/api/retailers/${id}`);
        // const data = await response.json();
        
        // For now, using mock data based on ID
        const mockData = {
          '1': {
            storeName: 'Tech Gadgets Store',
            ownerName: 'John Smith',
            email: 'john.smith@techgadgets.com',
            phone: '+1 234 567 8900',
            address: '123 Tech Street, Silicon Valley, CA 94043',
            businessLicense: 'BL-2023-001'
          },
          '2': {
            storeName: 'Fashion Boutique',
            ownerName: 'Sarah Johnson',
            email: 'sarah@fashionboutique.com',
            phone: '+1 234 567 8901',
            address: '456 Fashion Ave, New York, NY 10001',
            businessLicense: 'BL-2023-002'
          },
          '3': {
            storeName: 'Home Essentials',
            ownerName: 'Mike Brown',
            email: 'mike@homeessentials.com',
            phone: '+1 234 567 8902',
            address: '789 Home St, Chicago, IL 60601',
            businessLicense: 'BL-2023-003'
          },
          '4': {
            storeName: 'Gourmet Delights',
            ownerName: 'Emma Wilson',
            email: 'emma@gourmetdelights.com',
            phone: '+1 234 567 8903',
            address: '321 Food Court, San Francisco, CA 94105',
            businessLicense: 'BL-2023-004'
          },
          '5': {
            storeName: 'Sports & Fitness',
            ownerName: 'David Chen',
            email: 'david@sportsfitness.com',
            phone: '+1 234 567 8904',
            address: '555 Athletic Blvd, Boston, MA 02108',
            businessLicense: 'BL-2023-005'
          }
        };

        const storeData = mockData[id] || mockData['1']; // Fallback to first store if ID not found
        setFormData({
          ...storeData,
          profileImage: null
        });
      } catch (error) {
        console.error('Error fetching retailer data:', error);
      }
    };

    fetchRetailerData();
    setIsEditing(false);
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

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'failed':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return <FaCheckCircle />;
      case 'pending':
        return <FaTimesCircle />;
      case 'failed':
        return <FaTimesCircle />;
      default:
        return null;
    }
  };

  return (
    <div className="view-profile-container">
      <div className="profile-header">
        <div className="header-left">
          <h1>Customer Profile</h1>
          <span className="status-badge active">{retailerData.status}</span>
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
                  <label>Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
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
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Business License</label>
                  <input
                    type="text"
                    name="businessLicense"
                    value={formData.businessLicense}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ) : (
              <>
                <h2>{formData.ownerName}</h2>
                <div className="contact-info">
                  <p><FaEnvelope /> {formData.email}</p>
                  <p><FaPhone /> {formData.phone}</p>
                  <p><FaMapMarkerAlt /> {formData.address}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="profile-card recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {retailerData.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon" style={{ color: getStatusColor(activity.status) }}>
                  {getStatusIcon(activity.status)}
                </div>
                <div className="activity-details">
                  <p className="activity-text">{activity.details}</p>
                  <span className="activity-date">{activity.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card documents">
          <h3><FaFileAlt /> Documents</h3>
          <div className="documents-list">
            {retailerData.documents.map((doc, index) => (
              <div key={index} className="document-item">
                <div className="document-info">
                  <span className="document-name">{doc.name}</span>
                  <span className={`document-status ${doc.status}`}>{doc.status}</span>
                </div>
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="view-document">
                  View Document
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersProfile; 