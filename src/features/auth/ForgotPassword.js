import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "../assets/css/Signin.scss";
import "../../assets/css/Signin.scss";
import { forgotPassword } from "../../services/wepickApi";
import ButtonLoader from "../../atoms/buttonLoader";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const emailReference = useRef(null);

  const [empty, setEmpty] = useState(0);
  const [email, setEmail] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!empty.email) {
      setEmail(0);
    } else {
      setEmail(1);
    }
  }, [empty.email]);

  const handleInput = (event) => {
    setEmpty((empty) => ({
      ...empty,
      [event.target.name]: event.target.value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!empty.email) {
      setEmail(1);
      emailReference.current.focus();
      return;
    }

    if (!empty.email.match(/[@]/)) {
      setError("Please enter a valid email address");
      emailReference.current.focus();
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword({ email: empty.email });
      setSuccess("Password reset instructions have been sent to your email");
      setEmpty({ email: "" });
      // Optionally navigate to verify OTP page
      // navigate("/verify-otp");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send reset instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fluid-container ">
        <div className="sign-page">
          <div className="sign-page-background d-flex align-items-center">
            <div className="row m-0 sign-page-background-row ">
              <div className="col-1 col-lg-3  "></div>

              <div className="col-10 col-lg-6 px-lg-5 wepick-logo d-flex justify-content-center flex-column">
                <div className="  ">
                  <div className="row  mx-lg-5 px-lg-4 pt-3 pb-2 siginup-inner">
                    <div className="col-12 my-4 d-flex justify-content-center forgot-text1">
                      <p className="mb-1">Recover Account</p>
                    </div>

                    <div className="col-12 forgot-text2">
                      <p className="mb-0"></p>
                      Please enter your email address. You will receive a link
                      to create a new password via email.
                    </div>

                    {error && (
                      <div className="col-12 mt-3">
                        <p className="text-danger text-center">{error}</p>
                      </div>
                    )}

                    {success && (
                      <div className="col-12 mt-3">
                        <p className="text-success text-center">{success}</p>
                      </div>
                    )}

                    <div className="col-12 mt-3 signup-input-label">
                      <p className="mb-2 ">
                        Email Address
                        <span className="signup-staric-color">*</span>
                      </p>
                      <input
                        type="text"
                        onChange={handleInput}
                        name="email"
                        value={empty.email}
                        ref={emailReference}
                        disabled={isLoading}
                      />
                      {email ? (
                        <p className="mb-0 ">
                          <span className="error_message">
                            Email is a required field
                          </span>
                        </p>
                      ) : (
                        ""
                      )}
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
                          "Send"
                        )}
                      </button>
                    </div>

                    <div className="col-12 mt-4 mb-4 text-center">
                      <p className="mb-0">
                        Remember your password?{" "}
                        <Link to="/signin" className="wepick-link sign-text" style={{ color: "#1BC949", fontSize: "14px" }}>
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-1 col-lg-3  "></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
