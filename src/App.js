import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Privacy from "./pages/Privacy/Privacy";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SkeletonTheme } from "react-loading-skeleton";
import AdminArea from "./customHook/AdminArea";
import DashboardCom from "./components/DashboardComponents/DashboardCom";
import AllPosts from "./pages/Post/AllPosts";
import EditUniversity from "./components/University/EditUniversity";
import UsersPage from "./pages/Users/Users";
import University from "./pages/University/University";
import AllEvents from "./pages/Events/AllEvents";
// import BoostedPosts from "./pages/Post/BoostedPost";
// import AnonymousPosts from "./pages/Post/AnonymousPost";
import BoostedEvents from "./pages/Events/BoostedEvents";
import AnonymousEvents from "./pages/Events/AnonymousEvents";
import OfficialComunity from "./pages/Community/OfficialCommunity";
import CustomComunity from "./pages/Community/CustomCommunity";
// import BoostedStories from "./pages/Stories/BoostedStories";
import AllStories from "./pages/Stories/AllStories";
import Questions from "./pages/Moderations/Questions";
import Communities from "./pages/Moderations/Communities";
import Comments from "./pages/Moderations/Comments";
import AnonymousStories from "./pages//Stories/AnonymousStories";
import UserViewPage from "./pages/Users/UserView";
// import ManageRoles from "./components/DashboardComponents/ManageRoles";
import Statistics from "./pages/statistics";
import PostDetail from "./pages/PostDetail";
import SinglePostDetails from "./pages/Post/SinglePostDetails";
import Likes from "./pages/Likes/Likes";
import EventView from "./pages/Events/EventView";
import EditEvent from "./pages/Events/EditEvent";
import EditCommunity from "./pages/Community/EditCommunity";
import Posts from "./pages/Moderations/Posts";
import Events from "./pages/Moderations/Events";
import Stories from "./pages/Moderations/Stories";
import Users from "./pages/Moderations/Users";
import Boost from "./pages/Boost";
import AccountApproval from "./pages/Configuration/AccountApproval";
import ReportView from "./pages/ReportView";
import UserFriends from "./pages/Users/UserFriends";
import RetailersProfile from './pages/RetailersProfile';
import RetailersList from './pages/RetailersList';
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import DispatchedParcels from './pages/DispatchedParcels';
import ParcelDetails from './pages/ParcelDetails';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  const adminRoutes = [
    { path: "/", Comp: DashboardCom },
    { path: "/allpost", Comp: AllPosts },
    // { path: "/boostedpost", Comp: BoostedPosts },
    // { path: "/anonymouspost", Comp: AnonymousPosts },
    { path: "/users", Comp: UsersPage },
    { path: "/university", Comp: University },
    { path: "/events", Comp: AllEvents },
    { path: "/boostedevents", Comp: BoostedEvents },
    { path: "/event/view/:id", Comp: EventView },
    { path: "/event/edit/:id", Comp: EditEvent },
    { path: "/anonymousevents", Comp: AnonymousEvents },
    { path: "/officialcommunity", Comp: OfficialComunity },
    { path: "/withdrawalrequests", Comp: CustomComunity },
    { path: "/community/edit/:id", Comp: EditCommunity },
    { path: "/university/edit/:id", Comp: EditUniversity },
    { path: "/university/add", Comp: EditUniversity },
    { path: "/stories", Comp: AllStories },
    { path: "/boost", Comp: Boost },
    { path: "/anonymousstories", Comp: AnonymousStories },
    { path: "/users/detail/:id", Comp: UserViewPage },
    { path: "/users/likes/:id", Comp: Likes },
    { path: "/statistics", Comp: Statistics },
    { path: "/user/posts/:id", Comp: PostDetail },
    { path: "/user/posts/post-detail/:id", Comp: SinglePostDetails, name: 'userPostDetail' },
    { path: "/post/detail/:id", Comp: SinglePostDetails, name: 'postDetail' },
    { path: "/moderation/questions", Comp: Questions },
    { path: "/moderation/communities", Comp: Communities },
    { path: "/moderation/comments", Comp: Comments },
    { path: "/moderation/posts", Comp: Posts },
    { path: "/moderation/posts/post/:id", Comp: SinglePostDetails, name: 'moderationPostDetail' },
    { path: "/moderation/events", Comp: Events },
    { path: "/moderation/stories", Comp: Stories },
    { path: "/moderation/users", Comp: Users },
    { path: "/accountapproval", Comp: AccountApproval },
    { path: "/reportdetails", Comp: ReportView },
    { path: "/userfriends/:id", Comp: UserFriends },
    { path: "/viewprofile/:id", Comp: RetailersProfile },
    { path: "/viewdispatchedparcels", Comp: DispatchedParcels },
    { path: "/viewdispatchedparcels/:parcelId", Comp: ParcelDetails },
    { path: "/retailers", Comp: RetailersList },
    { path: "/retailers/:id", Comp: RetailersProfile },
  ];

  return (
    <>
      <ToastContainer closeOnClick={false} closeButton={true} />
      <SkeletonTheme baseColor="#D8D8D8" highlightColor="#c9c9c9">
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={!isLoggedIn ? <Signin /> : <Navigate to="/" />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/privacy" element={<Privacy />} />
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
