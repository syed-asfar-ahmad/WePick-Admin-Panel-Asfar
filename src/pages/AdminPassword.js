import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomToast } from "../atoms/toastMessage";
import ButtonLoader from "../atoms/buttonLoader";
import "./AdminPassword.scss";

const AdminPassword = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState({
    currentPassword: "password",
    newPassword: "password",
    confirmPassword: "password"
  });
  const [isLoading, setLoading] = useState(false);

  const togglePassword = (field) => {
    setPasswordType(prev => ({
      ...prev,
      [field]: prev[field] === "password" ? "text" : "password"
    }));
  };

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required("Current password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required")
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      // Here you would typically make an API call to change the password
      // For now, we'll simulate a successful password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      CustomToast({
        type: "success",
        message: "Password changed successfully"
      });
      resetForm();
      navigate("/dashboard");
    } catch (error) {
      CustomToast({
        type: "error",
        message: error.message || "Failed to change password"
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-password-container">
      <div className="password-header">
        <div className="password-icon">
          <i className="fa fa-lock"></i>
        </div>
        <h1>Change Password</h1>
        <p className="password-subtitle">Update your account password</p>
      </div>

      <div className="password-card">
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-section">
                <h3>Current Password</h3>
                <div className="form-group">
                  <label htmlFor="currentPassword">
                    <i className="fa fa-key"></i>
                    Current Password
                  </label>
                  <div className="input-group">
                    <Field
                      type={passwordType.currentPassword}
                      name="currentPassword"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePassword("currentPassword")}
                    >
                      <i className={`fa fa-${passwordType.currentPassword === "password" ? "eye-slash" : "eye"}`}></i>
                    </button>
                  </div>
                  <ErrorMessage
                    name="currentPassword"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>New Password</h3>
                <div className="form-group">
                  <label htmlFor="newPassword">
                    <i className="fa fa-lock"></i>
                    New Password
                  </label>
                  <div className="input-group">
                    <Field
                      type={passwordType.newPassword}
                      name="newPassword"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePassword("newPassword")}
                    >
                      <i className={`fa fa-${passwordType.newPassword === "password" ? "eye-slash" : "eye"}`}></i>
                    </button>
                  </div>
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="password-requirements">
                  <h4>Password Requirements</h4>
                  <ul>
                    <li><i className="fa fa-check-circle"></i> At least 8 characters long</li>
                    <li><i className="fa fa-check-circle"></i> One uppercase letter</li>
                    <li><i className="fa fa-check-circle"></i> One lowercase letter</li>
                    <li><i className="fa fa-check-circle"></i> One number</li>
                    <li><i className="fa fa-check-circle"></i> One special character</li>
                  </ul>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <i className="fa fa-lock"></i>
                    Confirm New Password
                  </label>
                  <div className="input-group">
                    <Field
                      type={passwordType.confirmPassword}
                      name="confirmPassword"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePassword("confirmPassword")}
                    >
                      <i className={`fa fa-${passwordType.confirmPassword === "password" ? "eye-slash" : "eye"}`}></i>
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
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
                  {isLoading ? <ButtonLoader /> : "Change Password"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AdminPassword; 