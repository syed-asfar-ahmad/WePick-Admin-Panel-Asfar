import React from "react";
import "../../components/University/university.scss";

const EventsForm = ({ formik }) => {
  return (
    <div className="uni-info">
      <p className="uni-heading">Event’s Information</p>
      <div className="uni-input">
        <div>
          <input
            type="text"
            placeholder="Mehmet’s Event"
            className="uni-name p-3"
            name="eventName"
            value={formik.values.eventName}
            onChange={formik.handleChange}
          ></input>
          {formik.errors.eventName ? (
            <span className="error-message">{formik.errors.eventName}</span>
          ) : null}
        </div>
        <div className="grid-inputs">
          <div>
            <input
              type="date"
              placeholder="mm/dd/yyyy"
              className="uni-name p-3"
              name="startDateAndTime"
              value={formik.values.startDateAndTime}
              onChange={formik.handleChange}
            ></input>
            {formik.errors.startDateAndTime ? (
              <span className="error-message">
                {formik.errors.startDateAndTime}
              </span>
            ) : null}
          </div>
          <div>
            <input
              type="date"
              placeholder="mm/dd/yyyy"
              className="uni-name p-3"
              name="endDateAndTime"
              value={formik.values.endDateAndTime}
              onChange={formik.handleChange}
            ></input>
            {formik.errors.endDateAndTime ? (
              <span className="error-message">
                {formik.errors.endDateAndTime}
              </span>
            ) : null}
          </div>
        </div>
        <div>
          <select
            className="uni-name p-3"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
          >
            <option value="" disabled>
              Select Location
            </option>
            <option value="In Person">In Person</option>
            <option value="Virtual">Virtual</option>
          </select>

          {formik.errors.location ? (
            <span className="error-message">{formik.errors.location}</span>
          ) : null}
        </div>
        {formik?.values?.location === "In Person" ? (
          <div>
            <input
              type="text"
              placeholder="Address"
              className="uni-name p-3"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
            ></input>
            {formik.errors.address ? (
              <span className="error-message">{formik.errors.address}</span>
            ) : null}
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="URL"
              className="uni-name p-3"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
            ></input>
            {formik.errors.address ? (
              <span className="error-message">{formik.errors.address}</span>
            ) : null}
          </div>
        )}
        <div>
          <textarea
            type="text"
            placeholder="Event details here..."
            className="uni-text-area p-3"
            name="detail"
            value={formik.values.detail}
            onChange={formik.handleChange}
          ></textarea>
          {formik.errors.detail ? (
            <span className="error-message">{formik.errors.detail}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EventsForm;
