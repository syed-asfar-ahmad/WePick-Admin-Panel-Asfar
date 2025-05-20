import React from "react";
import "./confirmationModal.scss";
import { AlertIcon } from "../../assets/icons";
import CustomButton from "../CustomButton/CustomButton";
import ButtonLoader from "../buttonLoader";

const ConfirmationModal = ({
  show,
  handleClose,
  handleConfirm,
  loading,
  message,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div
      className="modal-overlay "
      style={{ zIndex: "10000" }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-confirm"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content"
          style={{ borderRadius: "8px", padding: "20px" }}
        >
          <div className="text-center">{AlertIcon}</div>
          <div className="modal-body text-center">
            <p>{message}</p>
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <CustomButton
              text={loading ? <ButtonLoader /> : "Confirm"}
              backgroundColor={"#E90C0C"}
              textColor={"white"}
              borderColor={"none"}
              width={"115px"}
              height={"37px"}
              onClick={handleConfirm}
            />
            <CustomButton
              text={"Cancel"}
              backgroundColor={"#FFFFFF"}
              textColor={"#0D0D0D"}
              padding={"8px 2rem"}
              marginLeft={"0.5rem"}
              border={"1px solid #0D0D0D"}
              borderColor={"#0D0D0D"}
              onClick={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
