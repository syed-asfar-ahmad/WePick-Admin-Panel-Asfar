import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "../assets/css/Signin.scss";
// import wepick_logo from '../assets/images/common/wepick_logo.svg'

// Image
import logo from "../assets/images/wepick/logo-black.svg";

const ForgotPassword = () => {
  const emailReference = useRef(null);
  const passwordReference = useRef(null);

  const [empty, setEmpty] = useState(0);
  const [email, setEmail] = useState(0);

  useEffect(() => {
    if (!empty.email) {
      // setEmail(1)
    } else {
      setEmail(0);
    }
  });

  const handleInput = (event) => {
    setEmpty((empty) => ({
      ...empty,
      [event.target.name]: event.target.value,
    }));

    // const { name, value } = event.target;
    // setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!empty.email) {
      // alert("please enter email")
      setEmail(1);
      emailReference.current.focus();
    } else {
      setEmail(0);
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
                <img className="mb-3" src={logo} alt="WePick Logo" />

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
                      <button onClick={handleSubmit}>Send</button>
                    </div>

                    <div className="col-12 mt-4 mb-4 signup-lower-text">
                      <p className="mb-0">
                        Remember your password?{" "}
                        <span>
                          <Link className="wepick-link sign-text" to="/signin">
                            {" "}
                            Sign In{" "}
                          </Link>
                        </span>
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
