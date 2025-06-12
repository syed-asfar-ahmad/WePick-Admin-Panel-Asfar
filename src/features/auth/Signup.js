import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../assets/css/Signin.scss";
import CustomCheckbox from "../../components/common/CustomCheckbox";
import { signup } from "../../services/wepickApi";
import ButtonLoader from "../../atoms/buttonLoader";

const Signup = () => {
  let navigate = useNavigate();

  const firstNameReference = useRef(null);
  const lastNameReference = useRef(null);
  const emailReference = useRef(null);
  const passwordReference = useRef(null);

  const [empty, setEmpty] = useState(0);
  const [firstName, setFirstName] = useState(0);
  const [lastName, setLastName] = useState(0);
  const [email, setEmail] = useState(0);
  const [emailError, setEmailError] = useState(0);
  const [password, setPassword] = useState(0);
  const [passwordError, setPasswordError] = useState(0);
  const [passwordType, setPasswordType] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  useEffect(() => {
    if (!empty.email) {
      setEmail(0);
    }

    if (empty.email) {
      if (!empty.email.match(/[@]/)) {
        setEmailError(1);
      } else {
        setEmailError(0);
      }
    } else {
      setEmailError(0);
    }

    if (empty.password) {
      if (
        !empty.password.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|=\-{}[\]:";'<>?,./])[A-Za-z\d!@#$%^&*()_+|=\-{}[\]:";'<>?,./]{8,}$/
        )
      ) {
        setPasswordError(1);
      } else {
        setPasswordError(0);
      }
    } else {
      setPasswordError(0);
    }

    if (!empty.password) {
      setPassword(0);
    }

    if (!empty.firstname) {
      setFirstName(0);
    }

    if (!empty.lastname) {
      setLastName(0);
    }
  }, [empty.email, empty.password, empty.firstname, empty.lastname]);

  const handleInput = (event) => {
    setEmpty((empty) => ({
      ...empty,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!empty.firstname) {
      setFirstName(1);
      firstNameReference.current.focus();
      return;
    }
    if (!empty.lastname) {
      setLastName(1);
      lastNameReference.current.focus();
      return;
    }
    if (!empty.email) {
      setEmail(1);
      emailReference.current.focus();
      return;
    }
    if (!empty.email.match(/[@]/)) {
      setEmailError(1);
      emailReference.current.focus();
      return;
    }
    if (!empty.password) {
      setPassword(1);
      passwordReference.current.focus();
      return;
    }
    if (
      !empty.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|=\-{}[\]:";'<>?,./])[A-Za-z\d!@#$%^&*()_+|=\-{}[\]:";'<>?,./]{8,}$/
      )
    ) {
      setPasswordError(1);
      passwordReference.current.focus();
      return;
    }

    setIsLoading(true);
    try {
      const response = await signup({
        name: `${empty.firstname} ${empty.lastname}`,
        email: empty.email,
        password: empty.password,
        confirmPassword: empty.password,
        phoneNumber: "",
        userType: "admin"
      });

      setEmpty({
        firstname: "",
        lastname: "",
        email: "",
        password: ""
      });
      setEmail("");
      setEmailError(0);
      setPassword(0);
      setFirstName(0);
      setLastName(0);

      navigate("/signin");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to sign up. Please try again.");
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

              <div
                style={{ height: "100%" }}
                className="col-10 col-lg-6  px-lg-5 wepick-logo d-flex justify-content-center flex-column"
              >
                <div style={{ height: "100%" }} className="  ">
                  <div
                    style={{ height: "100%" }}
                    className="row  mx-lg-5 px-lg-4 pt-3 pb-2 siginup-inner"
                  >
                    <div className="col-12 d-flex justify-content-center signup-text1">
                      <p className="mb-1" style={{ color: "#1BC949" }}>ADMIN</p>
                    </div>

                    <div className="col-12 mb-4 d-flex justify-content-center signup-text2">
                      <p className="mb-0">Sign Up</p>
                    </div>

                    {error && (
                      <div className="col-12 mb-3">
                        <p className="text-danger text-center">{error}</p>
                      </div>
                    )}

                    <div className="col-12 mt-3 signup-input-label-input-top">
                      <div className="row ">
                        <div className="col-6 signup-input-label signup-input-label-input">
                          <p className="mb-2 ">
                            First Name
                            <span className="signup-staric-color">*</span>
                          </p>
                          <input
                            type="text"
                            onChange={handleInput}
                            name="firstname"
                            value={empty.firstname}
                            ref={firstNameReference}
                            disabled={isLoading}
                          />
                          {firstName ? (
                            <p className="mb-0 ">
                              <span className="error_message">
                                First name is a required field
                              </span>
                            </p>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="col-6 signup-input-label signup-input-label-input">
                          <p className="mb-2 ">
                            Last Name
                            <span className="signup-staric-color">*</span>
                          </p>
                          <input
                            type="text"
                            onChange={handleInput}
                            name="lastname"
                            value={empty.lastname}
                            ref={lastNameReference}
                            disabled={isLoading}
                          />
                          {lastName ? (
                            <p className="mb-0 ">
                              <span className="error_message">
                                Last Name is a required field
                              </span>
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mt-4 signup-input-label">
                      <p className="mb-2 ">
                        Your Email<span className="signup-staric-color">*</span>
                      </p>
                      <input
                        className=""
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

                      {emailError ? (
                        <p className="mb-0 ">
                          <span className="error_message">Invalid email</span>
                        </p>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="col-12 mt-4 mb-3 signup-input-label">
                      <p className="mb-2 ">
                        Password<span className="signup-staric-color">*</span>
                      </p>
                      <div className="password-input-wrapper">
                        <input
                          type={passwordType}
                          onChange={handleInput}
                          name="password"
                          value={empty.password}
                          ref={passwordReference}
                          disabled={isLoading}
                        />
                        <span
                          className="eye-icon"
                          onClick={togglePassword}
                          style={{ 
                            pointerEvents: isLoading ? "none" : "auto",
                            opacity: isLoading ? 0.6 : 1
                          }}
                        >
                          {passwordType === "password" ? (
                            <i className="fa fa-eye-slash" aria-hidden="true"></i>
                          ) : (
                            <i className="fa fa-eye" aria-hidden="true"></i>
                          )}
                        </span>
                      </div>
                      {password ? (
                        <p className="mb-0 ">
                          <span className="error_message">
                            Password is a required field
                          </span>
                        </p>
                      ) : (
                        ""
                      )}

                      {passwordError ? (
                        <p className="mb-0 ">
                          <span className="error_message">
                            Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
                          </span>
                        </p>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="col-12 mb-2 resgister-button">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        style={{ backgroundColor: "#1BC949" }}
                      >
                        {isLoading ? (
                          <div className="">
                            <ButtonLoader />
                          </div>
                        ) : (
                          "Sign Up"
                        )}
                      </button>
                    </div>

                    <div className="col-12 mt-2 mb-4 text-center">
                      <p className="mb-0">
                        Already have an account?{" "}
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

export default Signup;