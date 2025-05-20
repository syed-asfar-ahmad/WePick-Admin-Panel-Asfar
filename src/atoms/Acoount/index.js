import React from "react";
import crossIcon from "../../assets/images/Frame 48.png";

export const copyIcon = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_376_6496)">
      <path
        d="M13.125 4.6875V13.125H4.6875V4.6875H13.125ZM13.125 3.75H4.6875C4.43886 3.75 4.2004 3.84877 4.02459 4.02459C3.84877 4.2004 3.75 4.43886 3.75 4.6875V13.125C3.75 13.3736 3.84877 13.6121 4.02459 13.7879C4.2004 13.9637 4.43886 14.0625 4.6875 14.0625H13.125C13.3736 14.0625 13.6121 13.9637 13.7879 13.7879C13.9637 13.6121 14.0625 13.3736 14.0625 13.125V4.6875C14.0625 4.43886 13.9637 4.2004 13.7879 4.02459C13.6121 3.84877 13.3736 3.75 13.125 3.75Z"
        fill="black"
      />
      <path
        d="M1.875 8.4375H0.9375V1.875C0.9375 1.62636 1.03627 1.3879 1.21209 1.21209C1.3879 1.03627 1.62636 0.9375 1.875 0.9375H8.4375V1.875H1.875V8.4375Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_376_6496">
        <rect width="15" height="15" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const AccountView = ({ showAccount, handleClose }) => {
  if (!showAccount) return null;

  const handleCopy = () => {
    if (showAccount?.accountNo) {
      navigator.clipboard
        .writeText(showAccount.accountNo)
        .then(() => {
          alert("Account number copied to clipboard!");
        })
        .catch(() => {
          alert("Failed to copy account number.");
        });
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-dialog modal-confirm"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className="modal-content"
          style={{
            borderRadius: "20px",
            paddingTop: "25px",
            paddingBottom: "35px",
          }}
        >
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
              borderRadius: "30px",
            }}
          >
            <div style={{ width: "70%", fontFamily: "Montserrat" }}>
              <p
                className=""
                style={{
                  display: "flex",
                  color: "#00000",
                  fontSize: "30px",
                  fontWeight: "600",
                }}
              >
                Bank Account Details
              </p>
              <div style={{ display: "flex", gap: "60px", marginTop: "10px" }}>
                <p style={{ fontSize: "14px", fontWeight: "600" }}>Bank Name</p>
                <p
                  style={{
                    color: "#999999",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {showAccount?.bankName ?? "---"}
                </p>
              </div>
              <div style={{ display: "flex", gap: "6rem", marginTop: "10px" }}>
                <p style={{ fontSize: "14px", fontWeight: "600" }}>Name</p>
                <p
                  style={{
                    color: "#999999",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {showAccount?.ownerName ?? "---"}
                </p>
              </div>
              <div
                style={{ display: "flex", gap: "1.5rem", marginTop: "10px" }}
              >
                <p style={{ fontSize: "14px", fontWeight: "600" }}>
                  Account Number
                </p>
                <div style={{ display: "flex", gap: "5px" }}>
                  <p
                    style={{
                      color: "#999999",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {showAccount?.accountNo ?? "---"}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      cursor: "pointer",
                      marginTop: "3px",
                    }}
                    onClick={handleCopy}
                  >
                    {copyIcon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountView;
