import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/css/Signin.scss";
import { resetPassword } from "../services/wepickApi";
import ButtonLoader from "../atoms/buttonLoader";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordType, setPasswordType] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleInput = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setError("");
  };

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|=\-{}[\]:";'<>?,./])[A-Za-z\d!@#$%^&*()_+|=\-{}[\]:";'<>?,./]{8,}$/.test(
      password
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!email) {
      setError("Email not found. Please try the forgot password process again.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      // Navigate to sign in page after successful password reset
      navigate("/signin");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fluid-container">
      <div className="sign-page">
        <div className="sign-page-background d-flex align-items-center">
          <div className="row m-0 sign-page-background-row">
            <div className="col-1 col-lg-3"></div>

            <div className="col-10 col-lg-6 px-lg-5 wepick-logo d-flex justify-content-center flex-column">
              <div>
                <div className="row mx-lg-5 px-lg-4 pt-3 pb-2 siginup-inner">
                  <div className="col-12 my-4 d-flex justify-content-center forgot-text1">
                    <p className="mb-1">Reset Password</p>
                  </div>

                  <div className="col-12 forgot-text2">
                    <p className="mb-0">
                      Please enter your new password.
                    </p>
                  </div>

                  {error && (
                    <div className="col-12 mt-3">
                      <p className="text-danger text-center">{error}</p>
                    </div>
                  )}

                  <div className="col-12 mt-3 signup-input-label">
                    <p className="mb-2">
                      New Password
                      <span className="signup-staric-color">*</span>
                    </p>
                    <div
                      className="d-flex position-relative"
                      style={{ height: "54px", borderRadius: "8px" }}
                    >
                      <input
                        type={passwordType}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInput}
                        placeholder="Enter new password"
                        disabled={isLoading}
                      />
                      <div className="loginPasswordPositionBottom input-group-btn">
                        <h1
                          className="eyeBtn pr-4"
                          onMouseUp={togglePassword}
                          onMouseDown={togglePassword}
                          onTouchStart={togglePassword}
                          onTouchEnd={togglePassword}
                          onClick={togglePassword}
                          style={{
                            pointerEvents: isLoading ? "none" : "auto",
                            opacity: isLoading ? 0.6 : 1,
                          }}
                        >
                          <p
                            style={{
                              width: "10px",
                              height: "5px",
                              color: "Black",
                              border: "none",
                              marginTop: "-13px",
                            }}
                          >
                            {passwordType === "password" ? (
                              <i
                                className="fa fa-eye-slash"
                                aria-hidden="true"
                                style={{ cursor: isLoading ? "default" : "pointer" }}
                              ></i>
                            ) : (
                              <i
                                className="fa fa-eye"
                                aria-hidden="true"
                                style={{ cursor: isLoading ? "default" : "pointer" }}
                              ></i>
                            )}
                          </p>
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mt-3 signup-input-label">
                    <p className="mb-2">
                      Confirm Password
                      <span className="signup-staric-color">*</span>
                    </p>
                    <input
                      type={passwordType}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInput}
                      placeholder="Confirm new password"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="col-12 mt-4 resgister-button">
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      style={{ backgroundColor: "#1BC949" }}
                    >
                      {isLoading ? (
                        <div className="">
                          <ButtonLoader />
                        </div>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </div>

                  <div className="col-12 mt-4 mb-4 text-center">
                    <p className="mb-0">
                      Remember your password?{" "}
                      <button
                        onClick={() => navigate("/signin")}
                        className="wepick-link sign-text"
                        style={{
                          color: "#1BC949",
                          fontSize: "14px",
                          background: "none",
                          border: "none",
                          padding: 0,
                        }}
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-1 col-lg-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 