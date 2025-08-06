import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../assets/css/dashboard.scss";

import DashboardCom from "../components/DashboardComponents/DashboardCom";
import FullScreenMenu from "../components/DashboardComponents/FullScreenMenu";
import SiteFooter from "../organisms/Footer/Footer";
import Header from "../organisms/Header/Header";
import Privacy from "./Privacy/Privacy";
import Loading from "../components/common/Loading";

const Dashboard = () => {
  let location = useLocation();
  const [menu, setMenu] = useState(0);
  const [menuLeft, setMenuLeft] = useState("col-3");
  const [menuRight, setMenuRight] = useState("col-9");
  const [menuLeftText, setMenuLeftText] = useState("");
  const [menuLeftRightDropDown1, setMenuLeftRightDropDown1] = useState("col-10");
  const [menuLeftRightDropDown2, setMenuLeftRightDropDown2] = useState("col-2");
  const [menuIconCenter, setMenuIconCenter] = useState("");
  const [menuIconLeftPadding, setMenuIconLeftPadding] = useState("pl-3");
  const [MobileMenu1, setMobileMenu1] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [menuDropDownFullScreen, setMenuDropDownFullScreen] = useState({
    name: "dashboard",
    toggle: false,
    subMenuMobile: {
      subname: "",
      subtoggle: false,
    },
    patient: {
      toggle: false,
    },
    doc: {
      toggle: false,
    },
  });

  useEffect(() => {
    function handleResize() {
      setIsLargeScreen(window.innerWidth > 991);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isLargeScreen) {
      setMenuLeft("col-0");
      setMenuRight("col-12");
    } else {
      setMenuLeft("col-3");
      setMenuRight("col-9");
    }
  }, [isLargeScreen]);

  useEffect(() => {
    // Simulate page loading time and ensure all components are ready
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleMenu = () => {
    if (isLargeScreen) {
      if (menu === 0) {
        setMenu(1);
        setMenuLeft("col-0");
        setMenuRight("col-12");
        setMenuLeftText("none");
        setMenuIconCenter("justify-content-center");
        setMenuIconLeftPadding("");
        setMenuLeftRightDropDown1("col-12");
        setMenuLeftRightDropDown2("");
      } else {
        setMenu(0);
        setMenuLeft("col-3");
        setMenuRight("col-9");
        setMenuLeftText("");
        setMenuIconCenter("");
        setMenuIconLeftPadding("pl-3");
        setMenuLeftRightDropDown1("col-10");
        setMenuLeftRightDropDown2("col-2");
      }
    }
  };

  return (
    <>
      {location.pathname === "/privacy" ? (
        <Privacy />
      ) : isPageLoading ? (
        <Loading />
      ) : (
        <div className="fluid-container">
          <div className="row m-0 pr-0 ">
            <div
              className={
                MobileMenu1
                  ? " notheight1 notheight2"
                  : "notheight1 mobile-screen"
              }
            >
              <div
                className={
                  MobileMenu1
                    ? " notheight "
                    : "notheight InnerClassMobileScreen headerMobileSideBar "
                }
              >
                <i
                  className="MobileMenu1Icon ml-2 mt-2 fa fa-times"
                  aria-hidden="true"
                  onClick={() => setMobileMenu1(!MobileMenu1)}
                ></i>

                <FullScreenMenu
                  menuDropDownFullScreen={menuDropDownFullScreen}
                  setMenuDropDownFullScreen={(newChildData) => {
                    setMenuDropDownFullScreen(newChildData);
                  }}
                  menuIconLeftPadding={menuIconLeftPadding}
                  menuIconCenter={menuIconCenter}
                  menuLeftText={menuLeftText}
                  menuLeftRightDropDown1={menuLeftRightDropDown1}
                  menuLeftRightDropDown2={menuLeftRightDropDown2}
                  MobileMenu1={MobileMenu1}
                  setMobileMenu1={(newChildData) => {
                    setMobileMenu1(newChildData);
                  }}
                />
              </div>
            </div>

            <Header
              handleMenu={handleMenu}
              isLargeScreen={isLargeScreen}
              menuDropDownFullScreen={menuDropDownFullScreen}
              setMenuDropDownFullScreen={(data) => {
                setMenuDropDownFullScreen(data);
              }}
              menu={menu}
              setMobileMenu1={(data) => {
                setMobileMenu1(data);
              }}
              MobileMenu1={MobileMenu1}
              menuLeftText={menuLeftText}
            />

            <div className="col-12">
              <div className="row">
                {isLargeScreen ? (
                  <div className={`${menuLeft} animation-dashboard`}>
                    <FullScreenMenu
                      menuDropDownFullScreen={menuDropDownFullScreen}
                      setMenuDropDownFullScreen={(newChildData) => {
                        setMenuDropDownFullScreen(newChildData);
                      }}
                      menuIconLeftPadding={menuIconLeftPadding}
                      menuIconCenter={menuIconCenter}
                      menuLeftText={menuLeftText}
                      menuLeftRightDropDown1={menuLeftRightDropDown1}
                      menuLeftRightDropDown2={menuLeftRightDropDown2}
                      setMobileMenu1={(newChildData) => {
                        "";
                      }}
                      MobileMenu1={""}
                    />
                  </div>
                ) : (
                  ""
                )}
                <div
                  className={`${menuRight} animation-dashboard`}
                  style={{ background: "#F8F9FA" }}
                >
                  {location.pathname === "/dashboard" ? (
                    <DashboardCom />
                  ) : (
                    <DashboardCom />
                  )}
                  <div className="row">
                    <SiteFooter />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
