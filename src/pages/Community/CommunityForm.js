import React from "react";
import "../../components/University/university.scss";

const CommunityForm = ({ formik,id }) => {
  return (
    <div className="uni-info">
      <p className="uni-heading">Community’s Information</p>
      <div className="uni-input">
        <div>
          <input
            type="text"
            placeholder="Community Name"
            className="uni-name p-3"
            name="communityName"
            value={formik.values.communityName}
            onChange={formik.handleChange}
            disabled={id}
          ></input>
          {formik.errors.communityName ? (
            <span className="error-message">{formik.errors.communityName}</span>
          ) : null}
        </div>

        <div>
          <textarea
            type="text"
            placeholder="Add bio here..."
            className="uni-text-area p-3"
            name="bio"
            value={formik.values.bio}
            onChange={formik.handleChange}
            disabled={id}
          ></textarea>
          {formik.errors.bio ? (
            <span className="error-message">{formik.errors.bio}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CommunityForm;
