import React from "react";

// png
// import SampleImg from "../../assets/images/dashboard/user_icon.png";
// import SampleImg from "../../assets/images/profile.png";
import { DummyUserProfile, Logout } from "../../assets/icons";
// svg
// eslint-disable-next-line no-unused-vars
import ClockIcon from "../../assets/images/dashboard/ClockIcon.svg";
// eslint-disable-next-line no-unused-vars
import LogoutIcon from "../../assets/images/dashboard/LogoutIcon.svg";

import { useDispatch, useSelector } from "react-redux";
import { clearAuthentication } from "../../redux/feature/AuthSlice";
import { useNavigate } from "react-router-dom";

const ProfileDropDown = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  return (
    <div className="dropdown">
      <div
        className="profile-menu-button-right-img"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {user?.profile_pic ? (
          <img
            src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${user.profile_pic}`}
            className="menu-button-right-img menu-button"
            alt=""
          />
        ) : (
          <DummyUserProfile />
        )}
      </div>

      <div
        className="profile-drop-down-body dropdown-menu py-2"
        aria-labelledby="dropdownMenuButton"
        style={{ boxShadow: "0px 1px 14px 0px rgba(0, 0, 0, 0.08)" }}
      >
        <div className="row py-2 px-3 ">
          <div className="col-4">
            <DummyUserProfile size={"31px"} />
          </div>

          <div className="col-8 px-2 d-flex  justify-content-center align-items-start  flex-column">
            <p className="mb-0  profile-drop-down-text1">{user?.role}</p>

            <p className="mb-0 profile-drop-down-text2">Super Admin</p>
          </div>
        </div>

        <div
          className="row pb-0 pt-2 px-3"
          onClick={() => {
            dispatch(clearAuthentication());
            localStorage.removeItem("token");
            // navigate("/signin");
            window.location.href = "/signin";
          }}
        >
          <div className="col-4">
            <Logout />
          </div>
          <div className="col-8 px-2 d-flex align-items-center">
            <span className="mb-0 profile-drop-down-text1 cursor-pointer text-danger">
              Logout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropDown;
