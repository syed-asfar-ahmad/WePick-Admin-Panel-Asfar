import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomToast } from "../atoms/toastMessage";
import ButtonLoader from "../atoms/buttonLoader";
import "./ProfileEdit.scss";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    address: Yup.string()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters"),
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('address', values.address);
      if (avatar) {
        formData.append('avatar', avatar);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.put('/api/admin/profile', formData, config);
      
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
      setLoading(false);
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

      <div className="profile-card">
        <Formik
          initialValues={{
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || ""
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
                    <label htmlFor="firstName">
                      <i className="fa fa-user"></i>
                      First Name
                    </label>
                    <div className="input-group">
                      <Field
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                      />
                    </div>
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">
                      <i className="fa fa-user"></i>
                      Last Name
                    </label>
                    <div className="input-group">
                      <Field
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                      />
                    </div>
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fa fa-envelope"></i>
                    Email Address
                  </label>
                  <div className="input-group">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <i className="fa fa-phone"></i>
                    Phone Number
                  </label>
                  <div className="input-group">
                    <Field
                      type="tel"
                      name="phone"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Location</h3>
                <div className="form-group">
                  <label htmlFor="address">
                    <i className="fa fa-map-marker"></i>
                    Address
                  </label>
                  <div className="input-group">
                    <Field
                      as="textarea"
                      name="address"
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="error-message"
                  />
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
                  className="submit-button"
                  disabled={isSubmitting || isLoading}
                >
                  {isLoading ? <ButtonLoader /> : "Save Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProfileEdit;