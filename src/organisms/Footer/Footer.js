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
          className="pb-1"
          src={CopyRightIcon}
          alt=""
        />{" "}
        <span style={{ color: "#1BC949" }}>WePick</span> {currentYear}. ALL RIGHTS RESERVED
      </span>
    </div>
  );
};

export default Footer;
