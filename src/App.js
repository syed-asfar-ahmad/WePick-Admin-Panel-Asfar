import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

// Components
import AdminArea from "./customHook/AdminArea";
import ForgotPassword from "./pages/ForgotPassword";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import DashboardCom from "./components/DashboardComponents/DashboardCom";
import CustomersList from "./components/DashboardComponents/CustomersList";
import CustomersProfile from "./components/DashboardComponents/CustomersProfile";
import ReceivedDetails from "./components/DashboardComponents/ReceivedDetails";
import ReceivedParcels from "./components/DashboardComponents/ReceivedParcels";
import UsersPage from "./pages/Users/Users";
import UserViewPage from "./pages/Users/UserView";
import UserFriends from "./pages/Users/UserFriends";
import RetailersProfile from './pages/RetailersProfile';
import RetailersList from './pages/RetailersList';
import DispatchedParcels from './pages/DispatchedParcels';
import ParcelDetails from './pages/ParcelDetails';
import ParcelsList from './components/Parcels/ParcelsList';
import LockersList from './components/Lockers/LockersList';
import Notifications from './pages/Notifications';
import { NotificationsProvider } from './context/NotificationsContext';
import AdminPassword from './pages/AdminPassword';
import ProfileEdit from "./pages/ProfileEdit";
import ReportParcels from './components/DashboardComponents/wepick/ReportParcels';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  const adminRoutes = [
    { path: "/dashboard", Comp: DashboardCom },
    { path: "/users", Comp: UsersPage },
    { path: "/customers", Comp: CustomersList },
    { path: "/customers/:id", Comp: CustomersProfile },
    { path: "/receivedparcels", Comp: ReceivedParcels },
    { path: "/receivedparcels/:parcelId", Comp: ReceivedDetails },
    { path: "/users/detail/:id", Comp: UserViewPage },
    { path: "/userfriends/:id", Comp: UserFriends },
    { path: "/viewprofile/:id", Comp: RetailersProfile },
    { path: "/viewdispatchedparcels", Comp: DispatchedParcels },
    { path: "/viewdispatchedparcels/:parcelId", Comp: ParcelDetails },
    { path: "/retailers", Comp: RetailersList },
    { path: "/retailers/:id", Comp: RetailersProfile },
    { path: "/parcelslist", Comp: ParcelsList },
    { path: "/parcels/listallparcels", Comp: ParcelsList },
    { path: "/customerslist", Comp: UsersPage },
    { path: "/viewreceivedparcels", Comp: ParcelsList },
    { path: "/listoflockers", Comp: LockersList },
    { path: "/location", Comp: LockersList },
    { path: "/status", Comp: LockersList },
    { path: "/unlockoption", Comp: LockersList },
    { path: "/sentnotification", Comp: ParcelsList },
    { path: "/filters", Comp: ParcelsList },
    { path: "/lockerusage", Comp: ParcelsList },
    { path: "/simplecharts", Comp: ParcelsList },
    { path: "/adminpassword", Comp: AdminPassword },
    { path: "/profileedit", Comp: ProfileEdit },
    { path: "/notifications", Comp: Notifications },
    { path: "/reportparcels", Comp: ReportParcels },
  ];

  return (
    <NotificationsProvider>
      <ToastContainer closeOnClick={false} closeButton={true} />
      <SkeletonTheme baseColor="#D8D8D8" highlightColor="#c9c9c9">
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={!isLoggedIn ? <Signin /> : <Navigate to="/" />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/signup" element={<Signup />} />
            
            {isLoggedIn ? (
              <>
                {adminRoutes.map(({ path, Comp, name }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <AdminArea>
                        <Comp name={name} />
                      </AdminArea>
                    }
                  />
                ))}
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <>
                <Route path="*" element={<Navigate to="/signin" />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </SkeletonTheme>
    </NotificationsProvider>
  );
}

export default App;
