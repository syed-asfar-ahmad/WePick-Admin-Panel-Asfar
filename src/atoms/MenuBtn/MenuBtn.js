import React from "react";

const MenuBtn = ({
  handleMenu,
  menu,
  menuDropDownFullScreen,
  setMenuDropDownFullScreen,
}) => {
  return (
    <div
      className="border box-shadow-hover1 cursor-pointer cursor-pointer menu-button p-4 mr-2 d-flex align-items-center justify-content-center"
      onClick={() => {
        handleMenu();

        setMenuDropDownFullScreen({
          ...menuDropDownFullScreen,
          name: "dashboard",
          toggle: !menuDropDownFullScreen.toggle,
        });
      }}
    >
      <i class={`${!menu ? "fa fa-times" :  "fa-solid fa-bars"}`}></i>
    </div>
  );
};

export default MenuBtn;
