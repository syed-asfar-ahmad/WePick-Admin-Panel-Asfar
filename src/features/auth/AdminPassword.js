import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomToast } from "../../atoms/toastMessage";
import ButtonLoader from "../../atoms/buttonLoader";
import "./AdminPassword.scss";
import Loading from '../../components/common/Loading';
import { adminChangePassword } from "../../services/wepickApi";


const AdminPassword = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState({
    currentPassword: "password",
    newPassword: "password",
    confirmPassword: "password"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [passwordChecks, setPasswordChecks] = useState({
    length: null,
    uppercase: null,
    lowercase: null,
    number: null,
    specialChar: null
  });

  const togglePassword = (field) => {
    setPasswordType(prev => ({
      ...prev,
      [field]: prev[field] === "password" ? "text" : "password"
    }));
  };

  const checkPasswordRequirements = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^a-zA-Z0-9]/.test(password)
    };
    setPasswordChecks(checks);
    return checks;
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
    setIsLoading(true);
    try {
      const requestData = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmPassword
      };
      
      const response = await adminChangePassword(requestData);
      
      // Check if response is successful (either direct or nested)
      if (response?.success || response?.data?.success) {
        CustomToast({
          type: "success",
          message: response?.message || response?.data?.message || "Password changed successfully"
        });
        resetForm();
        navigate("/dashboard");
      } else {
        throw new Error(response?.message || response?.data?.message || "Failed to change password");
      }
    } catch (error) {
      CustomToast({
        type: "error",
        message: error.response?.data?.message || error.message || "Failed to change password"
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handlePasswordChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    if (name === "newPassword") {
      checkPasswordRequirements(value);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getCheckIcon = (condition) => {
    if (condition === null) return null;
    return condition ? (
      <i className="fa fa-check-circle check-icon valid"></i>
    ) : (
      <i className="fa fa-times-circle check-icon invalid"></i>
    );
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
        {isLoading ? (
          <>
          <Loading />
          </>
        ) : (
          <>
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
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
                      onChange={(e) => handlePasswordChange(e, setFieldValue)}
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
                    <li>
                      {getCheckIcon(passwordChecks.length)}
                      At least 8 characters long
                    </li>
                    <li>
                      {getCheckIcon(passwordChecks.uppercase)}
                      One uppercase letter
                    </li>
                    <li>
                      {getCheckIcon(passwordChecks.lowercase)}
                      One lowercase letter
                    </li>
                    <li>
                      {getCheckIcon(passwordChecks.number)}
                      One number
                    </li>
                    <li>
                      {getCheckIcon(passwordChecks.specialChar)}
                      One special character
                    </li>
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
        </>
        )}
      </div>
    </div>
  );
};

export default AdminPassword;