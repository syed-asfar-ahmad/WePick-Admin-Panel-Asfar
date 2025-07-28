import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

// Components
import AdminArea from "./customHook/AdminArea";
import ForgotPassword from "./features/auth/ForgotPassword";
import Signin from "./features/auth/Signin";
import Signup from "./features/auth/Signup";
import Loading from "./components/common/Loading";
import DashboardCom from "./features/dashboard/DashboardCom";
import CustomersList from "./features/users/customers/CustomersList";
import CustomersProfile from "./features/users/customers/CustomersProfile";
import ReceivedDetails from "./features/parcels/ReceivedDetails";
import ReceivedParcels from "./features/users/customers/ReceivedParcels";
import RetailersProfile from './features/users/retailers/RetailersProfile';
import RetailersList from './features/users/retailers/RetailersList';
import DispatchedParcels from './features/users/retailers/DispatchedParcels';
import ParcelDetails from './features/parcels/ParcelDetails';
import ParcelsList from './features/parcels/ParcelsList';
import LockersList from './features/Lockers/LockersList';
import Notifications from './features/notifications/Notifications';
import { NotificationsProvider } from './context/NotificationsContext';
import AdminPassword from './features/auth/AdminPassword';
import ProfileEdit from "./features/auth/ProfileEdit";
import ReportParcels from './features/dashboard/reportdetails/ReportParcels';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const adminRoutes = [
    { path: "/dashboard", Comp: DashboardCom },
    { path: "/loading", Comp: Loading },
    { path: "/customers", Comp: CustomersList },
    { path: "/customers/:id", Comp: CustomersProfile },
    { path: "/receivedparcels", Comp: ReceivedParcels },
    { path: "/receivedparcels/:parcelId", Comp: ReceivedDetails },
    { path: "/viewprofile/:id", Comp: RetailersProfile },
    { path: "/viewdispatchedparcels", Comp: DispatchedParcels },
    { path: "/viewdispatchedparcels/:parcelId", Comp: ParcelDetails },
    { path: "/retailers", Comp: RetailersList },
    { path: "/retailers/:id", Comp: RetailersProfile },
    { path: "/parcelslist", Comp: ParcelsList },
    { path: "/parcels/listallparcels", Comp: ParcelsList },
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
    { path: "/editprofile", Comp: ProfileEdit },
    { path: "/notifications", Comp: Notifications },
    { path: "/reportparcels", Comp: ReportParcels },
  ];

  return (
    <NotificationsProvider>
      <ToastContainer closeOnClick={false} closeButton={true} />
      <SkeletonTheme baseColor="#D8D8D8" highlightColor="#c9c9c9">
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={!isAuthenticated ? <Signin /> : <Navigate to="/" />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/signup" element={<Signup />} />
            
            {isAuthenticated ? (
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
