import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SkeletonTheme } from "react-loading-skeleton";
import AdminArea from "./customHook/AdminArea";
import DashboardCom from "./components/DashboardComponents/DashboardCom";
import CustomersList from "./components/DashboardComponents/CustomersList";
import CustomersProfile from "./components/DashboardComponents/CustomersProfile";
import ReceivedDetails from "./components/DashboardComponents/ReceivedDetails";
import ReceivedParcels from "./components/DashboardComponents/ReceivedParcels";
import EditUniversity from "./components/University/EditUniversity";
import UsersPage from "./pages/Users/Users";
import UserViewPage from "./pages/Users/UserView";
import UserFriends from "./pages/Users/UserFriends";
import RetailersProfile from './pages/RetailersProfile';
import RetailersList from './pages/RetailersList';
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import DispatchedParcels from './pages/DispatchedParcels';
import ParcelDetails from './pages/ParcelDetails';
import ParcelsList from './components/Parcels/ParcelsList';
import LockersList from './components/Lockers/LockersList';

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
    { path: "/university/edit/:id", Comp: EditUniversity },
    { path: "/university/add", Comp: EditUniversity },
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
    { path: "/adminpassword", Comp: ParcelsList },
    { path: "/profileedit", Comp: ParcelsList },
  ];

  return (
    <>
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
    </>
  );
}

export default App;
