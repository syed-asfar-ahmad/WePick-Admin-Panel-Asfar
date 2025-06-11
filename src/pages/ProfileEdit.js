import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomToast } from "../atoms/toastMessage";
import ButtonLoader from "../atoms/buttonLoader";
import "./ProfileEdit.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../services/wepickApi";
import Loading from '../components/common/Loading';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (user?.profileImage) {
      setAvatarPreview(user.profileImage);
    }
  }, [user]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    businessName: Yup.string()
      .required("Business name is required")
      .min(2, "Business name must be at least 2 characters"),
    businessAddress: Yup.string()
      .required("Business address is required")
      .min(5, "Business address must be at least 5 characters"),
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

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
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

  const confirmDeleteAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    const fileInput = document.getElementById('avatar-input');
    if (fileInput) {
      fileInput.value = '';
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
      formData.append('businessName', values.businessName);
      formData.append('businessAddress', values.businessAddress);
      if (avatar) {
        formData.append('profileImage', avatar);
      }

      const response = await updateProfile(formData);
      
      CustomToast({
        type: "success",
        message: "Profile updated successfully"
      });
      resetForm();
      navigate("/dashboard");
    } catch (error) {
      CustomToast({
        type: "error",
        message: error.response?.data?.message || "Failed to update profile"
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
                <img src={avatarPreview} alt="Profile" />
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
              name: user?.name || "",
              phoneNumber: user?.phoneNumber || "",
              businessName: user?.businessName || "",
              businessAddress: user?.businessAddress || ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
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

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="businessName">
                        <i className="fa fa-building"></i>
                        Business Name
                      </label>
                      <div className="input-group">
                        <Field
                          type="text"
                          name="businessName"
                          placeholder="Enter business name"
                        />
                      </div>
                      <ErrorMessage
                        name="businessName"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="businessAddress">
                        <i className="fa fa-map-marker"></i>
                        Business Address
                      </label>
                      <div className="input-group">
                        <Field
                          type="text"
                          name="businessAddress"
                          placeholder="Enter business address"
                        />
                      </div>
                      <ErrorMessage
                        name="businessAddress"
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
                    onClick={() => navigate("/dashboard")}
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