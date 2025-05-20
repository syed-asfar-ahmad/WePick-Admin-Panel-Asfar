import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Phone.scss";

const Phone = ({
  value,
  handleChange,
  name,
  field,
  disabled,
  label = "Phone No",
}) => {
  const handleInputChange = (phone) => {
    field.onChange(phone);
    handleChange(phone, name);
  };

  return (
    <>
      <p className="mb-2">{label}<span className="text-danger">*</span></p>
      <PhoneInput
        disabled={disabled}
        disableDropdown // Add this prop to disable the country code dropdown
        inputProps={{
          name: name,
          ref: field.ref,
          onChange: handleInputChange,
          onBlur: field.onBlur,
        }}
        country={"kw"}
        value={value}
        inputStyle={{ width: "36.6px" }}
        inputClass="w-100"
        onBlur={field.onBlur}
      />
    </>
  );
};

export default Phone;
