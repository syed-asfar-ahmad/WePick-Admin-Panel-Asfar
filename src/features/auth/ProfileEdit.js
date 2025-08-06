import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomToast } from "../../atoms/toastMessage";
import ButtonLoader from "../../atoms/buttonLoader";
import "./ProfileEdit.scss";
import { useDispatch, useSelector } from "react-redux";
import { adminEditProfile } from "../../services/wepickApi";
import { updateUserProfile } from "../../redux/feature/AuthSlice";
import Loading from '../../components/common/Loading';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useSelector((state) => state.auth || {});

  // Use Redux user data for profile
  // Get image base URL with fallback
  const getImageBaseUrl = () => {
    return process.env.REACT_APP_IMAGE_BASE_URL || 'http://35.183.208.209';
  };

  // Test different possible image paths
  const testImagePath = (imagePath) => {
    if (!imagePath) return null;
    
    const normalizedPath = imagePath.replace(/\\/g, '/');
    const baseUrl = getImageBaseUrl();
    
    // Try different possible paths
    const possiblePaths = [
      `${baseUrl}/${normalizedPath}`,
      `${baseUrl}/api/${normalizedPath}`,
      `${baseUrl}/images/${normalizedPath}`,
      `${baseUrl}/public/${normalizedPath}`,
      `${baseUrl}/static/${normalizedPath}`,
    ];
    
    // Add cache-busting parameter to prevent caching
    const timestamp = Date.now();
    return `${possiblePaths[0]}?t=${timestamp}`;
  };

  useEffect(() => {
    if (user) {
      setUserProfile(user);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.profileImage) {
      const imagePath = user.profileImage;
      setAvatarPreview(testImagePath(imagePath));
    } else if (user?.profile_pic) {
      const imagePath = user.profile_pic;
      setAvatarPreview(testImagePath(imagePath));
    }
  }, [user, userProfile]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]*$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .optional(),
  });

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        CustomToast({
          type: "error",
          message: "Image size should be less than 5MB"
        });
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        CustomToast({
          type: "error",
          message: "Only JPG, PNG and GIF images are allowed"
        });
        return;
      }

      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setShowDeleteModal(true);
  };

  const handleCancel = (resetForm) => {
    // Reset form fields to empty values
    resetForm({
      values: {
        name: "",
        phoneNumber: ""
      }
    });
    
    // Clear avatar preview and file input
    setAvatar(null);
    setAvatarPreview(null);
    const fileInput = document.getElementById('avatar-input');
    if (fileInput) {
      fileInput.value = '';
    }
    
    // You can navigate back if needed
    // navigate("/dashboard");
  };

  const confirmDeleteAvatar = async () => {
    try {
      // Create form data with empty profile image to remove it
      const formData = new FormData();
      formData.append('name', userProfile?.name || user?.name || '');
      formData.append('phoneNumber', userProfile?.phoneNumber || user?.phoneNumber || '');
      formData.append('removeProfileImage', 'true'); // Signal to remove profile image
      
      const response = await adminEditProfile(formData);
      
      if (response?.success || response?.data?.success) {
        // Update Redux state to remove both profile_pic and profileImage
        dispatch(updateUserProfile({ 
          profile_pic: null, 
          profileImage: null 
        }));
        
        // Clear local state
        setAvatar(null);
        setAvatarPreview(null);
        const fileInput = document.getElementById('avatar-input');
        if (fileInput) {
          fileInput.value = '';
        }
        
        CustomToast({
          type: "success",
          message: "Profile picture removed successfully"
        });
        
        // Update local state to reflect the changes
        setUserProfile(prev => ({
          ...prev,
          profile_pic: null,
          profileImage: null
        }));
      }
    } catch (error) {
      CustomToast({
        type: "error",
        message: "Failed to remove profile picture"
      });
    }
    
    setShowDeleteModal(false);
  };

  const cancelDeleteAvatar = () => {
    setShowDeleteModal(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('phoneNumber', values.phoneNumber);
      if (avatar) {
        formData.append('profileImage', avatar);
      }
      
                   const response = await adminEditProfile(formData);
      
      if (response?.success || response?.data?.success) {
        // Update Redux state with new profile data
        const updatedProfileData = {
          name: values.name,
          phoneNumber: values.phoneNumber,
        };
        
        // If there's a new profile image URL in the response, include it
        if (response?.data?.profileImage || response?.profileImage) {
          const imagePath = response.data?.profileImage || response.profileImage;
          // Save in both properties for consistency
          updatedProfileData.profile_pic = imagePath;
          updatedProfileData.profileImage = imagePath;
          
          // Generate full URL with cache-busting
          const fullImageUrl = testImagePath(imagePath);
          
          // Briefly clear the preview then set it again to force re-rendering
          setAvatarPreview(null);
          
          // Preload the image to ensure it's in browser cache
          const img = new Image();
          img.src = fullImageUrl;
          
          // Set the preview after a short delay
          setTimeout(() => {
            setAvatarPreview(fullImageUrl);
          }, 100);
        }
        
        // Dispatch the update to Redux
        dispatch(updateUserProfile(updatedProfileData));
        
        CustomToast({
          type: "success",
          message: response?.message || response?.data?.message || "Profile updated successfully"
        });
        
        // Update local state with new values
        setUserProfile(prev => ({
          ...prev,
          ...updatedProfileData
        }));
        
        // Reset form with new values
        resetForm({
          values: {
            name: values.name,
            phoneNumber: values.phoneNumber
          }
        });
        
        // Clear avatar file input
        setAvatar(null);
        const fileInput = document.getElementById('avatar-input');
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        throw new Error(response?.message || response?.data?.message || "Failed to update profile");
      }
    } catch (error) {
      CustomToast({
        type: "error",
        message: error.response?.data?.message || error.message || "Failed to update profile"
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-edit-container">
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <h3>Delete Profile Photo</h3>
            <p>Are you sure you want to delete your profile photo?</p>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={cancelDeleteAvatar}
              >
                Cancel
              </button>
              <button 
                className="delete-button"
                onClick={confirmDeleteAvatar}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
                         {avatarPreview ? (
               <div className="avatar-with-controls">
                                   <img 
                    src={avatarPreview} 
                    alt="Profile" 
                                         onError={(e) => {
                       // Image failed to load
                     }}
                     onLoad={(e) => {
                       // Image loaded successfully
                     }}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
                 <button 
                   onClick={handleDeleteAvatar}
                   type="button"
                   className="delete-avatar-btn"
                   aria-label="Delete profile photo"
                 >
                   <i className="fas fa-trash"></i>
                 </button>
               </div>
             ) : (
              <i className="fa fa-user"></i>
            )}
          </div>
          <div className="avatar-controls">
            {!avatarPreview && (
              <label htmlFor="avatar-input" className="control-btn">
                <i className="fas fa-camera"></i>
              </label>
            )}
          </div>
          <input
            type="file"
            id="avatar-input"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
        </div>
        <h1>Edit Profile</h1>
        <p className="profile-subtitle">Update your personal information</p>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="profile-card">
          <Formik
            initialValues={{
              name: userProfile?.name || user?.name || "",
              phoneNumber: userProfile?.phoneNumber || user?.phoneNumber || ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, resetForm }) => (
              <Form>
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">
                        <i className="fa fa-user"></i>
                        Name
                      </label>
                      <div className="input-group">
                        <Field
                          type="text"
                          name="name"
                          placeholder="Enter your name"
                        />
                      </div>
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phoneNumber">
                        <i className="fa fa-phone"></i>
                        Phone Number
                      </label>
                      <div className="input-group">
                        <Field
                          type="text"
                          name="phoneNumber"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="error-message"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => handleCancel(resetForm)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-button"
                    disabled={isSubmitting || isLoading}
                  >
                    {isLoading ? <ButtonLoader /> : "Save Changes"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;