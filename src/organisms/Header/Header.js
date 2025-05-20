import React from "react";

import logo from "../../assets/images/wepick/logo-black.svg";
import ProfileDropDown from "../../molecules/ProfileDropDown/ProfileDropDown";
import MenuBtnMobile from "../../atoms/MenuBtnMobile/MenuBtnMobile";
import { Link } from "react-router-dom";

const Header = ({ isLargeScreen, setMobileMenu1, MobileMenu1 }) => {
  return (
    <div className="w-100">
      {isLargeScreen ? (
        <div className="d-flex border-bottom pl-3">
          {/* fullscreen header  */}
          <Link to="/" style={{ cursor: "pointer" }}>
            <div
              className={`col-2 d-flex align-items-center  dashboard-logo py-3`}
            >
              <img src={logo} alt="WePick Logo" />
              <h2 style={{ color: "black" }}>WePick</h2>
            </div>
          </Link>

          <div
            className={
              "d-flex flex-grow-1 px-4 align-items-center justify-content-end"
            }
          >
            <ProfileDropDown />
          </div>
          {/* fullscreen header  */}
        </div>
      ) : (
        // mobile menu

        <div className="row border-bottom ">
          <div className="col-2 pl-4 dashboard-logo py-3">
            <MenuBtnMobile
              setMobileMenu1={(data) => {
                setMobileMenu1(data);
              }}
              MobileMenu1={MobileMenu1}
            />
          </div>
          <div
            className={`col-8 d-flex align-items-center  justify-content-center dashboard-logo py-3`}
          >
            <div className="d-flex">
              <img src={logo} alt="WePick Logo" />
              <h2>WePick</h2>
            </div>
          </div>
          <div className="col-2 d-flex justify-content-end align-items-center pr-4">
            <ProfileDropDown />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
