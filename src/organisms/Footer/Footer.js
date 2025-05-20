import React from "react";
import CopyRightIcon from "../../assets/images/dashboard/CopyRightIcon.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div
      className="site-footer d-flex justify-content-center align-items-center pr-5"
      style={{ width: "100%" }}
    >
      <span>
        <img
          style={{ fill: "#FF0000" }}
          className="pb-1"
          src={CopyRightIcon}
          alt=""
        />{" "}
        WePick {currentYear}. ALL RIGHTS RESERVED
      </span>
    </div>
  );
};

export default Footer;
