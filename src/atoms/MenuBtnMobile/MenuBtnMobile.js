import React from "react";

const MenuBtnMobile = ({ MobileMenu1, setMobileMenu1 }) => {
  return (
    <div className=" cursor-pointer menu-button p-4 mr-2 d-flex align-items-center justify-content-center">
      <i
        class="fa-solid fa-bars"
        onClick={() => {
          setMobileMenu1(!MobileMenu1);
        }}
      ></i>
    </div>
  );
};

export default MenuBtnMobile;
