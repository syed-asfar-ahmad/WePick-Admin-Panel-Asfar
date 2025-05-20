import React from "react";
import crossIcon from "../../assets/images/Frame 48.png";
import Reciept from "../../assets/icons/reciept.svg";

const RecieptView = ({ showReciept, handleClose, rows }) => {
  
  if (!showReciept) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-dialog modal-confirm"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-content">
          <img
            src={crossIcon}
            alt="crossIcon"
            className="cross-image"
            onClick={handleClose}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingBottom: "2rem",
            }}
          >
            <p
              className=""
              style={{
                paddingTop: "20px",
                paddingBottom: "20px",
                display: "flex",
                color: "#00000",
                fontSize: "30px",
                fontWeight: "600",
                fontFamily: 'Montserrat'
              }}
            >
              Receipt's Image
            </p>
            <img
              onClick={(e) => {
                e.stopPropagation();
              }}
              src={showReciept}
              alt="reciept"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecieptView;
