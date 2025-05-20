import React from "react";
import "./university.scss";

const UniversityForm = ({ formik,isView}) => {
  return (
    <div className="uni-info">
      <p className="uni-heading">University’s Information</p>
      <div className="uni-input">
        <div>
          <input
            type="text"
            placeholder="University Name"
            className="uni-name pl-2"
            name="universityName"
            value={formik.values.universityName}
            onChange={formik.handleChange}
          // onBlur={formik.handleBlur}
          disabled={!isView}
          ></input>
          {formik.errors.universityName ? (
            <span className="error-message">
              {formik.errors.universityName}
            </span>
          ) : null}
        </div>
        <div className="grid-inputs">
          <div>
            <input
              type="text"
              placeholder="Website Url"
              className="uni-name pl-2"
              name="websiteURL"
              value={formik.values.websiteURL}
              onChange={formik.handleChange}
              disabled={!isView}
            ></input>
            {formik.errors.websiteURL ? (
              <span className="error-message">{formik.errors.websiteURL}</span>
            ) : null}
          </div>
          <div>
            <input
              type="text"
              placeholder="University Name Abbreviation"
              className="uni-name pl-2"
              name="universityAbbreviation"
              value={formik.values.universityAbbreviation}
              onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
            disabled={!isView}
            ></input>
            {formik.errors.universityAbbreviation ? (
              <span className="error-message">
                {formik.errors.universityAbbreviation}
              </span>
            ) : null}
          </div>
        </div>
        <div>
          <input
            type="text"
            placeholder="University Domain"
            className="uni-name pl-2"
            name="universityDomain"
            value={formik.values.universityDomain}
            onChange={formik.handleChange}
          // onBlur={formik.handleBlur}
          disabled={!isView}
          ></input>
          {formik.errors.universityDomain ? (
            <span className="error-message">
              {formik.errors.universityDomain}
            </span>
          ) : null}
        </div>
        <div>
          <textarea
            type="text"
            placeholder="Please add some text about university..."
            className="uni-text-area p-3"
            name="aboutUniversity"
            value={formik.values.aboutUniversity}
            onChange={formik.handleChange}
            disabled={!isView}
          // onBlur={formik.handleBlur}
          ></textarea>
          {formik.errors.aboutUniversity ? (
            <span className="error-message">
              {formik.errors.aboutUniversity}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UniversityForm;
