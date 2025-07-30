import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FullScreenMenu from "../components/DashboardComponents/FullScreenMenu";
import Header from "../organisms/Header/Header";
import Footer from "../organisms/Footer/Footer";
import { useSelector } from "react-redux";
const AdminArea = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [state, setState] = useState({
    isLargeScreen: window.innerWidth > 991,
    MobileMenu1: true,
  });
  const divRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const handleResize = () => {
      setState((prevState) => ({
        ...prevState,
        isLargeScreen: window.innerWidth > 991,
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const toggleMobileMenu = () => {
    setState((prevState) => ({
      ...prevState,
      MobileMenu1: !prevState.MobileMenu1,
    }));
  };
  useEffect(() => {
    setTimeout(() => {
      // Scroll to the top of the div whenever the route changes
      if (divRef.current) {
        divRef.current.scrollTop = 0;
      }
    }, 500);
  }, [location.pathname]); // This effect runs when the path changes
  return (
    <div className="fluid-container">
      <div className="d-flex flex-column m-0 pr-0" style={{ height: "100vh" }}>
        <div
          className={
            state.MobileMenu1
              ? "notheight1 notheight2"
              : "notheight1 mobile-screen"
          }
        >
          <div
            className={
              state.MobileMenu1
                ? "notheight"
                : "notheight InnerClassMobileScreen headerMobileSideBar"
            }
          >
            <i
              className="MobileMenu1Icon ml-auto px-2 w-fit mt-2 fa fa-times"
              aria-hidden="true"
              onClick={toggleMobileMenu}
            ></i>
            <div className="border-top border-gray mt-2"></div>
            <FullScreenMenu />
          </div>
        </div>
        <Header
          isLargeScreen={state.isLargeScreen}
          setMobileMenu1={toggleMobileMenu}
          MobileMenu1={state.MobileMenu1}
        />
        <div className="overflow-auto d-flex flex-grow-1">
          {state.isLargeScreen && (
            <div
              style={{ width: "20rem", minWidth: "20rem" }}
              className="p-0 animation-dashboard overflow-auto h-100"
            >
              <FullScreenMenu />
            </div>
          )}
          <div
            className="px-3 flex-grow-1 animation-dashboard overflow-auto"
            style={{ background: "#F5F5F5", overflowY: "auto" }}
            ref={divRef}
          >
            <div style={{ minHeight: "84vh" }}>{children}</div>
            <div className="row">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminArea;











