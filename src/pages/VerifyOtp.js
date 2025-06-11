import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/css/Signin.scss";
import { verifyOtp } from "../services/wepickApi";
import ButtonLoader from "../atoms/buttonLoader";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (!email) {
      setError("Email not found. Please try the forgot password process again.");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp({ email, otp });
      // Navigate to reset password page with email
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to verify OTP. Please try again.");
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
                    <p className="mb-1">Verify OTP</p>
                  </div>

                  <div className="col-12 forgot-text2">
                    <p className="mb-0">
                      Please enter the OTP sent to your email address.
                    </p>
                  </div>

                  {error && (
                    <div className="col-12 mt-3">
                      <p className="text-danger text-center">{error}</p>
                    </div>
                  )}

                  <div className="col-12 mt-3 signup-input-label">
                    <p className="mb-2">
                      OTP
                      <span className="signup-staric-color">*</span>
                    </p>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
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
                        "Verify"
                      )}
                    </button>
                  </div>

                  <div className="col-12 mt-4 mb-4 text-center">
                    <p className="mb-0">
                      Didn't receive the OTP?{" "}
                      <button
                        onClick={() => navigate("/forgot-password")}
                        className="wepick-link sign-text"
                        style={{
                          color: "#1BC949",
                          fontSize: "14px",
                          background: "none",
                          border: "none",
                          padding: 0,
                        }}
                      >
                        Try Again
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

export default VerifyOtp; 