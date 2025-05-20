import React, { useState } from "react";
import { Button, Modal, Rate, Select, Slider } from "antd";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const AddRoleModal = ({ modal1Open, setModal1Open, typeName }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    country: "",
    contact: "",
    state: "",
    role: "",
    dynamicName: "",
  });

  const handleInputChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const isFormEmpty = Object.values(formValues).some(
    (value) => value === "" || value === undefined
  );

  const handleRoleChange = (value) => {
    handleInputChange("role", value);
  };

  const handleDynamicNameChange = (value) => {
    handleInputChange("dynamicName", value);
  };

  const handleCountryChange = (value) => {
    handleInputChange("country", value);
  };

  const handleStateChange = (value) => {
    handleInputChange("state", value);
  };

  const dynamicOptions = (() => {
    switch (formValues.role) {
      case "Doctor":
        return [
          { value: "John Smith", label: "Dr. John Smith" },
          { value: "Sarah Johnson", label: "Dr. Sarah Johnson" },
          // ...
        ];
      case "Hospital Admin":
        return [
          { value: "City Hospital", label: "City Hospital" },
          { value: "General Medical Center", label: "General Medical Center" },
          // ...
        ];
      case "Laboratory Admin":
        return [
          { value: "BioLab", label: "BioLab" },
          { value: "Clinical Diagnostics", label: "Clinical Diagnostics" },
          // ...
        ];
      case "Pharmacy Admin":
        return [
          { value: "MediPharm", label: "MediPharm" },
          { value: "HealthPlus Pharmacy", label: "HealthPlus Pharmacy" },
          // ...
        ];

      default:
        return [];
    }
  })();

  return (
    <>
      <Modal
        className="doctor-filter-modal"
        centered
        open={modal1Open}
        onCancel={() => setModal1Open(false)}
        width={681}
        footer={
          <div className="row px-3 mt-lg-4 mb-lg-4">
            <div className="col-12 pt-3 pb-2 d-flex justify-content-center mt-3">
              <button
                className={`apply-filter submit-pharmacy-edit ${
                  isFormEmpty ? "disabled" : ""
                }`}
                disabled={isFormEmpty}
              >
                Submit
              </button>
            </div>
          </div>
        }
      >
        <div className="row px-3 border-bottom">
          <div className="col-12 ">
            <p className="doc-add-filter">{typeName} Role</p>
          </div>
        </div>

        <div className="row mt-4 px-3">
          <div className="col-lg-6 pr-lg-1 doc-setting-input">
            <p className="mb-2">Role Type</p>
            <Select
              style={{ width: "100%" }}
              value={formValues.role}
              onChange={handleRoleChange}
              options={[
                { value: "Doctor", label: "Doctor" },
                { value: "Hospital Admin", label: "Hospital Admin" },
                { value: "Laboratory Admin", label: "Laboratory Admin" },
                { value: "Pharmacy Admin", label: "Pharmacy Admin" },
              ]}
            />
          </div>

          <div className="col-lg-6 mt-lg-0 mt-4 pl-lg-1 doc-setting-input">
            <p className="mb-2">
              {formValues.role === "Hospital Admin"
                ? "Hospitals"
                : formValues.role === "Doctor"
                ? "Doctors"
                : formValues.role === "Laboratory Admin"
                ? "Laboratories"
                : formValues.role === "Pharmacy Admin"
                ? "Pharmacies"
                : "Hospital"}
            </p>
            <Select
              style={{ width: "100%" }}
              value={formValues.dynamicName}
              onChange={handleDynamicNameChange}
              options={dynamicOptions}
            />
          </div>
        </div>

        <div className="row px-3 mt-4">
          <div className="col-lg-12 doc-setting-input">
            <p className="doc-add-filter-text">Name</p>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>
        </div>
        <div className="row px-3 mt-4">
          <div className="col-lg-12 doc-setting-input">
            <p className="doc-add-filter-text">Email</p>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              required
            />
          </div>
        </div>

        <div className="row px-3 mt-4">
          <div className="col-lg-12 doc-setting-input">
            <p className="mb-2">Country</p>
            <Select
              style={{ width: "100%" }}
              value={formValues.country}
              onChange={handleCountryChange}
              options={[
                { value: "Kuwait", label: "Kuwait" },
                { value: "Canada", label: "Canada" },
                { value: "United kingdom", label: "United Kingdom" },
                { value: "Pakistan", label: "Pakistan" },
              ]}
            />
          </div>
        </div>

        <div className="row mt-4 px-3">
          <div className="col-lg-6 pr-lg-1 doc-setting-input">
            <p className="mb-2">Contact</p>
            <PhoneInput
              country="US"
              value={formValues.contact}
              defaultCountry="KW"
              onChange={(value) => handleInputChange("contact", value)}
            />
          </div>

          <div className="col-lg-6 mt-lg-0 mt-4 pl-lg-1 doc-setting-input">
            <p className="mb-2">State</p>
            <Select
              name="state"
              value={formValues.state}
              onChange={handleStateChange}
              style={{ width: "100%" }}
              options={[
                { value: "Cardiology", label: "Cardiology" },
                { value: "Neurology", label: "Neurology" },
              ]}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddRoleModal;
