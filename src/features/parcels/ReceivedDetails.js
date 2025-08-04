import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaBox, FaStore, FaUser, FaMapMarkerAlt, FaArrowLeft, FaWeightHanging, FaCalendarAlt, FaUserFriends } from 'react-icons/fa';
import './ReceivedDetails.scss';
import Loading from '../../components/common/Loading';
import { getReceivedParcelById } from '../../services/wepickApi';
import { CustomToast } from '../../atoms/toastMessage';

const ReceivedDetails = () => {
  const { parcelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [parcel, setParcel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch parcel details from API
  const fetchParcelDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If we have parcel data from navigation state, use it
      if (location.state?.parcel) {
        setParcel(location.state.parcel);
        setIsLoading(false);
        return;
      }
      
      // Otherwise fetch from API using parcelId
      const response = await getReceivedParcelById(parcelId);
      
      const { success, message, data } = response;
      
      if (success) {
        setParcel(data || {});
      } else {
        setError(message || 'Failed to fetch parcel details');
        CustomToast({
          type: "error",
          message: message || 'Failed to fetch parcel details'
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to fetch parcel details');
      CustomToast({
        type: "error",
        message: error.response?.data?.message || error.message || 'Failed to fetch parcel details'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParcelDetails();
  }, [parcelId]);

  if (isLoading) {
    return (
      <div className="parcel-details-container">
        <Loading />
      </div>
    );
  }

  if (error || !parcel) {
    return (
      <div className="parcel-details-container">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate('/receivedparcels')}>
            <FaArrowLeft /> Back to Parcels
          </button>
          <h1>Parcel Details</h1>
        </div>
        <div className="error-message">
          <p>{error || 'Parcel not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parcel-details-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/receivedparcels')}>
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
                <span>{parcel.parcelId || parcel.id || 'N/A'}</span>
              </div>
            </div>
            <div className="info-item">
              <FaStore className="icon" />
              <div className="info-content">
                <label>Parcel Name</label>
                <span>{parcel.parcelName || 'N/A'}</span>
              </div>
            </div>
            <div className="info-item">
              <FaUserFriends className="icon" />
              <div className="info-content">
                <label>Sender Name</label>
                <span>{parcel.senderName || 'N/A'}</span>
              </div>
            </div>
            <div className="info-item">
              <FaUser className="icon" />
              <div className="info-content">
                <label>Recipient Name</label>
                <span>{parcel.recipientName || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Location & Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <div className="info-content">
                <label>From</label>
                <span>{parcel.from || 'N/A'}</span>
              </div>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <div className="info-content">
                <label>To</label>
                <span>{parcel.to || 'N/A'}</span>
              </div>
            </div>
            <div className="info-item">
              <FaWeightHanging className="icon" />
              <div className="info-content">
                <label>Weight</label>
                <span>{parcel.weight ? `${parcel.weight} kg` : '-'}</span>
              </div>
            </div>
            <div className="info-item">
              <FaCalendarAlt className="icon" />
              <div className="info-content">
                <label>Date</label>
                <span>{parcel.Date || (parcel.createdAt ? new Date(parcel.createdAt).toLocaleDateString() : 'N/A')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivedDetails;