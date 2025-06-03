import React from "react";

import logo from "../../assets/images/wepick/logo-no-background.png";
import ProfileDropDown from "../../molecules/ProfileDropDown/ProfileDropDown";
import NotificationDropDown from "../../molecules/NotificationDropDown/NotificationDropDown";
import MenuBtnMobile from "../../atoms/MenuBtnMobile/MenuBtnMobile";
import { Link } from "react-router-dom";
import "./Header.scss";

const Header = ({ isLargeScreen, setMobileMenu1, MobileMenu1 }) => {
  return (
    <div className="w-100">
      {isLargeScreen ? (
        <div className="d-flex border-bottom pl-3">
          {/* fullscreen header  */}
          <Link to="/" className="header-logo-link">
            <div className="col-2 d-flex align-items-center dashboard-logo py-3">
              <img src={logo} alt="WePick Logo" className="header-logo-img" />
              <h2 className="header-logo-text">WePick</h2>
            </div>
          </Link>

          <div className="d-flex flex-grow-1 px-4 align-items-center justify-content-end">
            <NotificationDropDown />
            <ProfileDropDown />
          </div>
        </div>
      ) : (
        // mobile menu
        <div className="row border-bottom">
          <div className="col-2 pl-4 dashboard-logo py-3">
            <MenuBtnMobile
              setMobileMenu1={(data) => {
                setMobileMenu1(data);
              }}
              MobileMenu1={MobileMenu1}
            />
          </div>
          <div className="col-8 d-flex align-items-center justify-content-center dashboard-logo py-3">
            <div className="d-flex header-logo-container">
              <img src={logo} alt="WePick Logo" className="header-logo-img" />
              <h2 className="header-logo-text">WePick</h2>
            </div>
          </div>
          <div className="col-2 d-flex justify-content-end align-items-center pr-4">
            <NotificationDropDown />
            <ProfileDropDown />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
