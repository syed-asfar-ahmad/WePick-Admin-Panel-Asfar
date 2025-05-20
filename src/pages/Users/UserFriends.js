import React, { useEffect, useState } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { getFriends } from "../../services/service";
import "../../assets/css/post.scss";
import { useParams } from "react-router-dom";
import "./user.scss";
import profile from "../../assets/images/Ellipse 221.png";
import { Box, CircularProgress } from "@mui/material";
import PageLoader from "../../components/common/PageLoader";

const UserFriends = () => {
  const { id } = useParams();
  const [friends, setFriends] = useState([]);
  const [loader, setLoader] = useState(false);

  const handlegetPostsData = async (id) => {
    setLoader(true);
    try {
      const response = await getFriends(id);
      if (response.success) {
        setFriends(response?.friends);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    handlegetPostsData(id);
  }, [id]);

  if (loader) {
    return <PageLoader />;
  }

  return (
    <div className="row px-2 pt-4">
      <div className="col-12">
        <div className="row d-flex align-items-end">
          <div className="col-12">
            <ListHeader
              mainHeading=""
              placeholder="Search user by name, email, university or course"
              btnText=""
              linkbtn=""
              linkBreadCrum="/users"
              blinkBreadCrumText="Users"
              blinkBreadCrumText1="Friends"
              searchShow={true}
            />
          </div>
        </div>
      </div>
      <div className="friend-main">
        {friends.length > 0 ? (
          friends.map((data, index) => (
            <div key={index} className="friend-sub">
              <div className="friend-content">
                <img className="friend-image" src={profile} alt="profile" />
                <div className="friends-details">
                  <p className="f-name">{data?.userName}</p>
                  <p className="f-university">Posted on {data?.university}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-friends">
            <p>No Friends Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFriends;
