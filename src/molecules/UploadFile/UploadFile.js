import React, { useRef, useState } from "react";

// img svg
import AddDocUploadImgeIcon from "../../assets/images/doctor/AddDocUploadImgeIcon.svg";
import DocRoleCrossIcon from "../../assets/images/doctor/DocRoleCrossIcon.svg";

const UploadFile = ({ setFormDataState, formDataState, name }) => {
  const [infoData, setInfoData] = useState("");
  const inputCertiRef = useRef();

  const handleCertificatesClick = () => {
    inputCertiRef.current.click();
  };

  const handleCertificatesUpload = (event) => {
    const file = event.target.files[0].name;
    setInfoData(file);
    if(name=='medical_history'){
      setFormDataState({ ...formDataState, medical_history: event.target.files[0] });
    }else{
      setFormDataState({ ...formDataState, certificate: event.target.files[0] });
    }
  };

  const handleRemoveImage = () => {
    setInfoData(null);
    setFormDataState((prevState) => ({ ...prevState, certificate: null }));

    // Reset the file input value to an empty string
    inputCertiRef.current.value = "";
  };

  return (
    <>
      <div
        className="doc-setting-input-certificates d-flex justify-content-between align-items-center w-100"
        style={{ backgroundColor: "white" }}
      >
        <div>
          {infoData ? (
            <span className="info-message pl-2">{infoData}</span>
          ) : (
            formDataState?.certificate && (
              <span className="info-message pl-2">Certificate</span>
            )
          )}
        </div>
        <div className="pr-2 d-flex justify-content-end align-items-center w-100">
          {formDataState?.certificate ? (
            <img
              className="cursor-pointer"
              src={DocRoleCrossIcon}
              onClick={handleRemoveImage}
              alt="del"
            />
          ) : (
            <img
              className="cursor-pointer"
              src={AddDocUploadImgeIcon}
              onClick={handleCertificatesClick}
              alt=""
            />
          )}
        </div>
        <input
          type="file"
          ref={inputCertiRef}
          onChange={handleCertificatesUpload}
          style={{ display: "none" }}
          accept=".pdf, image/*"
        />
      </div>
    </>
  );
};

export default UploadFile;
