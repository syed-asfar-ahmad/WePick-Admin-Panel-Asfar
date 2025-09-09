import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import logo from "../../assets/images/wepick/logo-no-background.png";
import "../../assets/css/Signin.scss";
import { loginUser } from "../../redux/feature/AuthSlice";
import ButtonLoader from "../../atoms/buttonLoader";
import { signin } from "../../services/wepickApi";
const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordType, setPasswordType] = useState("password");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
const handleSubmit = async (values, { setSubmitting }) => {
  setLoading(true);
  setError("");
  try {
    const resultAction = await dispatch(loginUser(values));
    // if (loginUser.fulfilled.match(resultAction)) {
if(resultAction?.payload && resultAction?.payload?.user?.userType==="admin"){
      // Navigate directly to dashboard
      navigate("/dashboard");
    } else {
      setError(resultAction.payload || "Invalid credentials.");
    }
  } catch (error) {
    setError("Something went wrong. Please try again.");
  }
  setLoading(false);
  setSubmitting(false);
};
  return (
    <div className="fluid-container ">
      <div className="sign-page">
        <div className="sign-page-background d-flex align-items-center">
          <div
            className="row m-0 sign-page-background-row  "
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <div className="custome_offset px-lg-5 wepick-logo d-flex justify-content-center flex-column">
              <div style={{ height: "100%", width: "100%" }}>
                <div className="row mx-lg-5 px-lg-5 pt-3 pb-2 siginup-inner py-5">
                  <div className="col-12 d-flex justify-content-center ">
                    <img className="mb-3" src={logo} alt="WePick Logo" style={{ width: '180px', height: 'auto' }} />
                  </div>
                  <div className="col-12 mb-3 d-flex justify-content-center signup-text2 mt-4">
                    <p className="mb-0">Log in</p>
                  </div>
                  {error && (
                    <div className="col-12 mb-3">
                      <p className="text-danger text-center">{error}</p>
                    </div>
                  )}
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form className="w-100">
                        <div className="col-12 mt-2 signup-input-label">
                          <Field
                            type="text"
                            name="email"
                            placeholder="Email"
                            className="form-control pl-3"
                            disabled={isLoading}
                          />
                          <ErrorMessage
                            name="email"
                            component="p"
                            className="signup-staric-color"
                          />
                        </div>
                        <div className="col-12 mt-4 mb-1 signup-input-label">
                          <div className="password-input-wrapper">
                            <Field
                              type={passwordType}
                              name="password"
                              placeholder="Password"
                              className="form-control"
                              disabled={isLoading}
                            />
                            <span
                              className="eye-icon"
                              onClick={togglePassword}
                              style={{ 
                                pointerEvents: isLoading ? "none" : "auto",
                                opacity: isLoading ? 0.6 : 1,
                                position: "absolute",
                                right: "15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#666",
                                zIndex: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "20px",
                                height: "20px"
                              }}
                            >
                              {passwordType === "password" ? (
                                <FaEyeSlash size={18} color="#666" />
                              ) : (
                                <FaEye size={18} color="#666" />
                              )}
                            </span>
                          </div>
                          <ErrorMessage
                            name="password"
                            component="p"
                            className="signup-staric-color"
                          />
                        </div>
                        <div className="col-12 mb-2 resgister-button">
                          <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            style={{ backgroundColor: "#1BC949" }}
                          >
                            {isLoading ? (
                              <div className="">
                                <ButtonLoader />
                              </div>
                            ) : (
                              "Log in"
                            )}
                          </button>
                        </div>
                        <div className="col-12 mt-3 mb-2 text-center">
                          <Link to="/forgotpassword" className="wepick-link sign-text" style={{ color: "#1BC949", fontSize: "14px" }}>
                            Forgot Password?
                          </Link>
                        </div>
                        {/* <div className="col-12 mt-2 mb-4 text-center">
                          <p className="mb-0">
                            Don't have an account?{" "}
                            <Link to="/signup" className="wepick-link sign-text" style={{ color: "#1BC949", fontSize: "14px" }}>
                              Sign Up
                            </Link>
                          </p>
                        </div> */}
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signin;
