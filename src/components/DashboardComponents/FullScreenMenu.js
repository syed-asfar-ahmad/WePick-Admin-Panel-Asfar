import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../assets/css/dashboard.scss";
import DownIcon from "../../assets/images/dashboard/DownIcon.svg";
import {
  BoostSvg,
  ComSvg,
  ConfigSvg,
  DashboardSvg,
  EventSvg,
  ModerationSvg,
  PostSvg,
  StatSvg,
  StorySvg,
  UniSvg,
  UserSvg,
} from "../../assets/icons";

const FullScreenMenu = () => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);

  const handleSubMenuToggle = (id) => {
    setActiveSubMenu(activeSubMenu === id ? null : id);
  };

  const handleMenuClick = (id) => {
    setSelectedMenu(id);
    setSelectedSubMenu(null); // Reset selected submenu when a new menu is clicked
  };

  const handleSubMenuClick = (menuId, subMenuId) => {
    setSelectedMenu(menuId);
    setSelectedSubMenu(subMenuId);
  };

  const menuData = [
    {
      id: 1,
      name: "Dashboard",
      link: "/",
      icon: DashboardSvg,
    },
    {
      id: 2,
      name: "Users",
      link: "/users",
      icon: UserSvg,
    },
    {
      id: 3,
      name: "Universities",
      link: "/university",
      icon: UniSvg,
    },
    {
      id: 5,
      name: "Posts",
      link: "/allpost",
      icon: PostSvg,
    },
    {
      id: 6,
      name: "Events",
      link: "/events",
      icon: EventSvg,
    },
    {
      id: 7,
      name: "Communities",
      link: "/officialcommunity",
      icon: ComSvg,
      submenu: [
        {
          id: 1,
          name: "Communities",
          link: "/officialcommunity",
        },
        {
          id: 2,
          name: "Withdrawal Requests",
          link: "/withdrawalrequests",
        },
      ],
    },
    {
      id: 8,
      name: "Stories",
      link: "/stories",
      icon: StorySvg,
    },
    {
      id: 9,
      name: "Boost",
      link: "/boost",
      icon: BoostSvg,
    },
    {
      id: 10,
      name: "Moderation",
      link: "/",
      icon: ModerationSvg,
      submenu: [
        {
          id: 1,
          name: "Posts",
          link: "/moderation/posts",
        },
        {
          id: 2,
          name: "Events",
          link: "/moderation/events",
        },
        {
          id: 3,
          name: "Stories",
          link: "/moderation/stories",
        },
        {
          id: 4,
          name: "Users",
          link: "/moderation/users",
        },
        {
          id: 5,
          name: "Questions",
          link: "/moderation/questions",
        },
        // {
        //   id: 6,
        //   name: "Communities",
        //   link: "/moderation/communities",
        // },
        // {
        //   id: 7,
        //   name: "Comments",
        //   link: "/moderation/comments",
        // },
      ],
    },
    {
      id: 11,
      name: "Configuration",
      icon: ConfigSvg,
      submenu: [
        {
          id: 1,
          name: "Account Approval",
          link: "/accountapproval",
        },
      ],
    },
    {
      id: 12,
      name: "Report Statistics",
      link: "/statistics",
      icon: StatSvg,
    },
  ];

  const renderSubMenu = (menuId, subMenu) => {
    return (
      <>
        {subMenu?.map((item) => (
          <NavLink
            to={item.link}
            key={item.id}
            className="sub-menu1-top-padding dashboard-main-hover py-3 my-1 left-drop-down d-flex align-items-center"
            style={{
              paddingLeft: "81px",
              color: selectedSubMenu === item.id ? "black" : "black",
            }}
            onClick={() => handleSubMenuClick(menuId, item.id)}
          >
            {item.name}
          </NavLink>

        ))}
      </>
    );
  };

  return (
    <div className="hover-effect h-100 mt-2">
      {menuData.map((item) => (
        <div
          key={item.id}
          className="menu-item border-bottom-custome"
          style={{ color: "#535353", userSelect: "none" }}
        >
          {item?.submenu ? (
            <div
              className={`d-flex align-items-center w-100 py-3 w-100 dashboard-main-hover cursor-pointer justify-content-center px-3 ${selectedMenu === item.id ? "selected-menu" : ""
                }`}
              onClick={() => {
                handleSubMenuToggle(item.id);
                handleMenuClick(item.id);
              }}
            >
              <div className="dashboard-left-icon">{item.icon}</div>

              <p
                className={`mb-0 pl-lg-3 pl-1  w-100 ${selectedMenu === item.id
                    ? "selected-menu"
                    : "dashboard-left-icon-text"
                  }`}
                style={{
                  color: "#0D0D0D",
                  userSelect: "none",
                }}
              >
                {item.name}
              </p>

              {item.submenu && (
                <div>
                  <img
                    className="size-small-screen"
                    onClick={() => handleSubMenuToggle(item.id)}
                    src={DownIcon}
                    alt=""
                    style={{
                      transform:
                        activeSubMenu === item.id
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to={item.link}
              className={`d-flex align-items-center py-3 w-100 dashboard-main-hover justify-content-center px-3 ${selectedMenu === item.id ? "selected-menu" : ""
                }`}
              onClick={() => handleMenuClick(item.id)}
            >
              <div className="dashboard-left-icon">{item.icon}</div>

              <p
                className={`mb-0 pl-lg-3 pl-1  text-left w-100 ${selectedMenu === item.id
                    ? "selected-menu"
                    : "dashboard-left-icon-text"
                  }`}
                style={{
                  color: "#0D0D0D",
                  userSelect: "none",
                }}
              >
                {item.name}
              </p>
            </NavLink>
          )}

          {activeSubMenu === item.id &&
            item.submenu &&
            renderSubMenu(item.id, item.submenu)}
        </div>
      ))}
    </div>
  );
};

export default FullScreenMenu;
