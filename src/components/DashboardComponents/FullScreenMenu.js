import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../assets/css/dashboard.scss";
import DownIcon from "../../assets/images/dashboard/DownIcon.svg";
import {
  // BoostSvg,
  // ComSvg,
  // ConfigSvg,
  // DashboardSvg,
  // EventSvg,
  // ModerationSvg,
  // PostSvg,
  // StatSvg,
  // StorySvg,
  // UniSvg,
  UserSvg,
} from "../../assets/icons";

// Add DashboardIcon component
const DashboardIcon = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="20" fill="#F5F5F5" />
    <path
      d="M15 15H18.3333V25H15V15Z"
      stroke="#6CAD61"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.6667 12.5H25V25H21.6667V12.5Z"
      stroke="#6CAD61"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M28.3333 17.5H31.6667V25H28.3333V17.5Z"
      stroke="#6CAD61"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.33333 17.5H11.6667V25H8.33333V17.5Z"
      stroke="#6CAD61"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Add ReportsSvg component
// const ReportsSvg = (
//   <svg
//     width="40"
//     height="40"
//     viewBox="0 0 40 40"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <rect width="40" height="40" rx="20" fill="#F5F5F5" />
//     <path
//       d="M25 15.8333H15C13.6193 15.8333 12.5 16.9526 12.5 18.3333V25.8333C12.5 27.214 13.6193 28.3333 15 28.3333H25C26.3807 28.3333 27.5 27.214 27.5 25.8333V18.3333C27.5 16.9526 26.3807 15.8333 25 15.8333Z"
//       stroke="#FF0000"
//       strokeWidth="1.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//     <path
//       d="M20 11.6667V15.8333"
//       stroke="#FF0000"
//       strokeWidth="1.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//     <path
//       d="M17.5 22.5H22.5"
//       stroke="#FF0000"
//       strokeWidth="1.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//     <path
//       d="M17.5 19.1667H22.5"
//       stroke="#FF0000"
//       strokeWidth="1.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </svg>
// );

// Add ParcelSvg component
const ParcelSvg = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="20" fill="#F5F5F5" />
    <path
      d="M28.3333 15.8333L20 10L11.6667 15.8333M28.3333 15.8333V24.1667C28.3333 24.3877 28.2455 24.5996 28.0893 24.7559C27.933 24.9121 27.721 25 27.5 25H12.5C12.279 25 12.067 24.9121 11.9107 24.7559C11.7545 24.5996 11.6667 24.3877 11.6667 24.1667V15.8333M28.3333 15.8333L20 21.6667M11.6667 15.8333L20 21.6667"
      stroke="#4169E1"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Add LockerSvg component
const LockerSvg = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="20" fill="#F5F5F5" />
    <path
      d="M25 18.3333H15C13.6193 18.3333 12.5 19.4526 12.5 20.8333V28.3333C12.5 29.714 13.6193 30.8333 15 30.8333H25C26.3807 30.8333 27.5 29.714 27.5 28.3333V20.8333C27.5 19.4526 26.3807 18.3333 25 18.3333Z"
      stroke="#6CAD61"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 18.3333V15.8333C17.5 14.2145 18.7145 13 20.3333 13H19.6667C21.2855 13 22.5 14.2145 22.5 15.8333V18.3333"
      stroke="#6CAD61"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 23.3333V26.6667"
      stroke="#6CAD61"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Add NotificationSvg component
const NotificationSvg = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="20" fill="#F5F5F5" />
    <path
      d="M20 28.997C20.3675 28.9885 20.7201 28.8504 20.9956 28.607C21.271 28.3636 21.4514 28.0306 21.505 27.667H17.4367C17.4918 28.0405 17.6807 28.3813 17.9683 28.6259C18.2559 28.8706 18.6225 29.0024 20 28.997Z"
      fill="#6CAD61"
    />
    <path
      d="M28.4635 25.2339C27.901 24.7324 27.4085 24.1576 26.9993 23.5247C26.5526 22.6512 26.2849 21.6973 26.2118 20.7189V17.8372C26.2095 17.4872 26.1782 17.138 26.1185 16.7931C25.6594 16.7013 25.2181 16.5358 24.8118 16.3031C24.9667 16.8017 25.0454 17.3209 25.0452 17.8431V20.7247C25.1167 21.9183 25.445 23.0823 26.0077 24.1372C26.4104 24.7754 26.8883 25.3629 27.431 25.8872H12.4918C13.0346 25.3629 13.5124 24.7754 13.9152 24.1372C14.4779 23.0823 14.8062 21.9183 14.8777 20.7247V17.8372C14.8746 17.1621 15.0047 16.4931 15.2606 15.8683C15.5165 15.2436 15.8931 14.6755 16.3688 14.1965C16.8446 13.7175 17.4101 13.337 18.0331 13.0769C18.6561 12.8168 19.3243 12.6821 19.9993 12.6806C20.9874 12.6814 21.9532 12.9736 22.776 13.5206C22.6853 13.1875 22.6344 12.8448 22.6243 12.4997V12.1322C22.0152 11.8326 21.3609 11.6355 20.6877 11.5489V10.8139C20.6877 10.6074 20.6056 10.4093 20.4596 10.2633C20.3136 10.1172 20.1155 10.0352 19.9089 10.0352C19.7024 10.0352 19.5043 10.1172 19.3583 10.2633C19.2122 10.4093 19.1302 10.6074 19.1302 10.8139V11.5781C17.6227 11.7907 16.243 12.5416 15.2459 13.692C14.2488 14.8425 13.7015 16.3148 13.7052 17.8372V20.7189C13.6321 21.6973 13.3644 22.6512 12.9177 23.5247C12.5157 24.1561 12.0311 24.7309 11.4769 25.2339C11.4147 25.2886 11.3648 25.3559 11.3306 25.4313C11.2964 25.5067 11.2787 25.5886 11.2786 25.6714V26.4647C11.2786 26.6194 11.34 26.7678 11.4494 26.8772C11.5588 26.9866 11.7072 27.0481 11.8619 27.0481H28.0785C28.2332 27.0481 28.3816 26.9866 28.491 26.8772C28.6004 26.7678 28.6618 26.6194 28.6618 26.4647V25.6714C28.6617 25.5886 28.644 25.5067 28.6098 25.4313C28.5756 25.3559 28.5257 25.2886 28.4635 25.2339Z"
      fill="#6CAD61"
    />
    <path
      d="M27 15.4163C28.6108 15.4163 29.9167 14.1105 29.9167 12.4997C29.9167 10.8888 28.6108 9.58301 27 9.58301C25.3892 9.58301 24.0833 10.8888 24.0833 12.4997C24.0833 14.1105 25.3892 15.4163 27 15.4163Z"
      fill="#6CAD61"
    />
  </svg>
);

// Add ProfileSvg component
const ProfileSvg = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="20" fill="#F5F5F5" />
    <path
      d="M20 20C22.7614 20 25 17.7614 25 15C25 12.2386 22.7614 10 20 10C17.2386 10 15 12.2386 15 15C15 17.7614 17.2386 20 20 20Z"
      stroke="#6CAD61"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M28.3333 30C28.3333 25.8579 24.6421 22.5 20 22.5C15.3579 22.5 11.6667 25.8579 11.6667 30"
      stroke="#6CAD61"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FullScreenMenu = () => {
  const navigate = useNavigate();
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  const [selectedNestedSubMenu, setSelectedNestedSubMenu] = useState(null);
  const [activeNestedSubMenu, setActiveNestedSubMenu] = useState(null);

  const handleSubMenuToggle = (id) => {
    setActiveSubMenu(activeSubMenu === id ? null : id);
  };

  const handleNestedSubMenuToggle = (id) => {
    setActiveNestedSubMenu(activeNestedSubMenu === id ? null : id);
  };

  const handleMenuClick = (id) => {
    setSelectedMenu(id);
    setSelectedSubMenu(null);
  };

  const handleSubMenuClick = (menuId, subMenuId, isNested = false) => {
    setSelectedMenu(menuId);
    if (isNested) {
      setSelectedNestedSubMenu(subMenuId);
      setSelectedSubMenu(null);
    } else {
      setSelectedSubMenu(subMenuId);
      setSelectedNestedSubMenu(null);
    }
  };

  const handleNavigation = (link) => {
    navigate(link);
  };

  

  const menuData = [
    {
      id: 1,
      name: "Dashboard",
      link: "/",
      icon: DashboardIcon,
    },
    {
      id: 2,
      name: "Users",
      link: "/users",
      icon: UserSvg,
      submenu: [
        {
          id: 1,
          name: "Retailers",
          link: "/retailers",
          submenu: [
            {
              id: 1,
              name: "Retailers List",
              link: "/retailers",
            },
            {
              id: 2,
              name: "Dispatched Parcels",
              link: "/viewdispatchedparcels",
            }
          ]
        },
        {
          id: 2,
          name: "Customers",
          link: "/customers",
          submenu: [
            {
              id: 1,
              name: "Customers List",
              link: "/customers",
            },
            {
              id: 2,
              name: "Received Parcels",
              link: "/receivedparcels",
            }
          ]
        },
      ]
    },
    {
      id: 3,
      name: "Parcels",
      link: "/parcels",
      icon: ParcelSvg,
      submenu: [
        {
          id: 1,
          name: "Parcels List",
          link: "/parcelslist"
        }
      ]
    },
    {
      id: 5,
      name: "Lockers",
      link: "/lockers",
      icon: LockerSvg,
      submenu: [
        {
          id: 1,
          name: "Lockers List",
          link: "/listoflockers",
        },
      ]
    },
    {
      id: 6,
      name: " Notifications",
      link: "/notifications",
      icon: NotificationSvg,
      submenu: [
        {
          id: 1,
          name: "View Notifications",
          link: "/notifications",
        },
       
      ]
    },
    // {
    //   id: 7,
    //   name: "Reports",
    //   link: "/reports",
    //   icon: ReportsSvg,
    //   submenu: [
    //     {
    //       id: 1,
    //       name: "Parcels",
    //       link: "/parcels",
    //     },
    //     {
    //       id: 2,
    //       name: "Users",
    //       link: "/users",
    //     },
    //     {
    //       id: 3,
    //       name: "Locker usage",
    //       link: "/lockerusage",
    //     },
    //     {
    //       id: 4,
    //       name: "Simple charts (Success vs Failed deliveries)",
    //       link: "/simplecharts",
    //     }
    //   ],
    // },
    {
      id: 8,
      name: "Profile Settings",
      link: "/profilesettings",
      icon: ProfileSvg,
      submenu: [
        {
          id: 1,
          name: "Change Admin Password",
          link: "/adminpassword",
        },
        {
          id: 2,
          name: "Edit Profile",
          link: "/editprofile",
        },
      ]
    },
   
  ];

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .sub-menu1-top-padding {
      position: relative;
      padding-left: 24px;
      color: #666;
    }

    .sub-menu1-top-padding::before {
      content: '';
      position: absolute;
      left: 65px;
      top: 50%;
      width: 5px;
      height: 5px;
      background: #666;
      border-radius: 50%;
      transform: translateY(-50%);
      opacity: 1;
    }

    .sub-menu1-top-padding.selected {
      color: #333;
      font-weight: 500;
    }

    .sub-menu1-top-padding.selected::before {
      opacity: 0.7;
    }

    .sub-menu1-top-padding:hover {
      color: #666;
    }
  `;
  document.head.appendChild(style);

  const renderSubMenu = (menuId, subMenu) => {
    return (
      <>
        {subMenu?.map((item) => (
          <div key={item.id}>
            <div
              className={`sub-menu1-top-padding dashboard-main-hover py-3 my-1 left-drop-down d-flex align-items-center ${
                selectedSubMenu === item.id ? 'selected' : ''
              }`}
              style={{
                paddingLeft: "81px",
                color: selectedSubMenu === item.id ? "#333" : "#666",
              }}
              onClick={(e) => {
                e.preventDefault();
                handleSubMenuClick(menuId, item.id, false);
                if (item.submenu) {
                  handleNestedSubMenuToggle(item.id);
                } else {
                  handleNavigation(item.link);
                }
              }}
            >
              <NavLink
                to={item.link}
                className="w-100 text-decoration-none"
                style={{ color: "inherit", cursor: "pointer" }}
                onClick={(e) => e.preventDefault()}
              >
                {item.name}
              </NavLink>
              {item.submenu && (
                <div style={{ marginRight: "15px" }}>
                  <img
                    className="size-small-screen"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNestedSubMenuToggle(item.id);
                    }}
                    src={DownIcon}
                    alt=""
                    style={{
                      transform: activeNestedSubMenu === item.id ? "rotate(-90deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                      opacity: 0.85,
                      width: '10px',
                      height: '10px'
                    }}
                  />
                </div>
              )}
            </div>
            {item.submenu && activeNestedSubMenu === item.id && (
              <div style={{ paddingLeft: "20px" }}>
                {item.submenu.map((subItem) => (
                  <NavLink
                    key={subItem.id}
                    to={subItem.link}
                    className={`sub-menu1-top-padding dashboard-main-hover py-3 my-1 left-drop-down d-flex align-items-center text-decoration-none ${
                      selectedNestedSubMenu === subItem.id ? 'selected' : ''
                    }`}
                    style={{
                      paddingLeft: "81px",
                      color: selectedNestedSubMenu === subItem.id ? "#333" : "#666",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubMenuClick(menuId, subItem.id, true);
                      if (!subItem.submenu) {
                        handleNavigation(subItem.link);
                      }
                    }}
                  >
                    {subItem.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
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
              className="d-flex align-items-center w-100 py-3 w-100 dashboard-main-hover cursor-pointer justify-content-center px-3"
              onClick={() => {
                handleSubMenuToggle(item.id);
                handleMenuClick(item.id);
              }}
              style={{
                animation: activeSubMenu === item.id ? "slideDown 0.3s ease-out" : "none"
              }}
            >
              <div className="dashboard-left-icon">{item.icon}</div>

              <p
                className="mb-0 pl-lg-3 pl-1 w-100 dashboard-left-icon-text"
                style={{
                  color: "#666",
                  userSelect: "none"
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
                          ? "rotate(-90deg)"
                          : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                      opacity: 0.85,
                      width: '10px',
                      height: '10px'
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to={item.link}
              className="d-flex align-items-center py-3 w-100 dashboard-main-hover justify-content-center px-3"
              onClick={() => handleMenuClick(item.id)}
            >
              <div className="dashboard-left-icon">{item.icon}</div>

              <p
                className="mb-0 pl-lg-3 pl-1 text-left w-100 dashboard-left-icon-text"
                style={{
                  color: "#666",
                  userSelect: "none"
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
