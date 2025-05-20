import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getPostById } from "../../services/service";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import SinglePost from "../../components/Post/SinglePost";
import crumbs from "../../services/crumbs";

const SinglePostDetails = ({ name }) => {
  const { id } = useParams();
  const location = useLocation();
  const { type } = location?.state || {};
  const [post, setPost] = useState({});
  const [linkBreadCrum, setLinkBreadCrum] = useState("/allpost");

  const handlegetPostData = async () => {
    try {
      const response = await getPostById({ id });

      if (response?.success) {
        const newPosts = response?.data;
        setPost(newPosts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (location.state?.from === "/moderation/posts") {
      setLinkBreadCrum("/moderation/posts");
    }
    handlegetPostData();

    // Scroll to the top of the div whenever the post changes or the location changes
  }, [location.state, id]);

  const breadCrumbItems = {
    userPostDetail: crumbs?.userPostDetail(post?.user?._id),
    postDetail: crumbs?.postDetail,
    moderationPostDetail: crumbs?.moderationPostDetail
  }

  return (
    <div
      className="row px-2 pt-4"

      // Example styles for the div
    >
      <div className="col-12">
        <div className="row d-flex align-items-end">
          <div className="col-12">
            <ListHeader
              mainHeading="Post"
              placeholder="Search Title"
              breadCrumbItems={breadCrumbItems[name]}
            />
          </div>
        </div>
      </div>
      <div className="col-12 px-0 mt-3 mb-3">
        <SinglePost post={post} autoFetch={true} autoFetchedPostElement={type} fetchOverAllPostData={true} />
      </div>
    </div>
  );
};

export default SinglePostDetails;
