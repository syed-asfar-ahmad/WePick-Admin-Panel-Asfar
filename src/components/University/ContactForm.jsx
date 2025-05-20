import React from "react";
import "./university.scss";

const ContactForm = ({ formik,isView }) => {
  return (
    <div className="course-section">
      <p className="course-heading">Contact Information</p>
      <div className="grid-inputs">
        <div>
          <input
            type="text"
            placeholder="Email"
            className="uni-name pl-2"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
            disabled={!isView}
          ></input>
          {formik.errors.email ? (
            <span className="error-message">{formik.errors.email}</span>
          ) : null}
        </div>
        <div>
          <input
            type="text"
            placeholder="Phone No"
            className="uni-name pl-2"
            name="phoneNo"
            value={formik.values.phoneNo}
            onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
            disabled={!isView}
          ></input>
          {formik.errors.phoneNo ? (
            <span className="error-message">{formik.errors.phoneNo}</span>
          ) : null}
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="Please enter address..."
          className="uni-name pl-2"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          // onBlur={formik.handleBlur}
          disabled={!isView}
        ></input>
        {formik.errors.address ? (
          <span className="error-message">{formik.errors.address}</span>
        ) : null}
      </div>
    </div>
  );
};

export default ContactForm;
