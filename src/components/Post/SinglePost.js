import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "../../assets/css/Carousel.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { TagSvg, blackCommentSvg, notLikedSvg } from "../../assets/icons";
import Comment from "./Comment";
import { deleteComment, getComments } from "../../services/service";
import dummy from "../../assets/images/university/dummy-profile.svg";
import ButtonLoader from "../../atoms/buttonLoader";
import { getRequest } from "../../services/api";
import { GET_COMMENTS, GET_POST_LIKES, GET_POST_TAGGED_PEOPLE } from "../../services/endpoint";
import { toast } from "react-toastify";
import VideoPlayer from "./VideoPlayer";

const SinglePost = ({ post, autoFetch, autoFetchedPostElement, fetchOverAllPostData }) => {
  const navigate = useNavigate();
  let settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
  };

  const [comments, setComments] = React.useState([]);
  const [commentClicked, setCommentClicked] = React.useState(
    autoFetch || false
  );
  function formatTimestamp(timestamp) {
    const date = moment(timestamp);
    // Format the day of the week
    // const daysOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    // const day = daysOfWeek[date.day()];
    const relativeTime = date.fromNow();
    const formattedTime = ` · ${relativeTime}`;
    return formattedTime;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState({
    data: [],
    isType: ''
  });

  const fetchData = async (key, reCall) => {

    if (postData?.isType === key && !reCall) {
      setPostData({ ...postData, isType: '' });
    }
    else {
      setIsLoading(true);
      const path = key === 'Likes' ? GET_POST_LIKES : key === 'Comments' ? GET_COMMENTS : GET_POST_TAGGED_PEOPLE;
      const response = await getRequest(`${path}/${post?._id}`);

      if (response?.success) {
        setPostData(postData => ({
          ...postData,
          isType: key,
          data:

            key === 'Likes' ?

              response?.data?.map((post) => ({
                profileImage: post?.user?.profileImage,
                username: post?.user?.userName,
                universityName: post?.university?.universityName
              }))

              :

              key === 'Comments' ?

                response?.data?.map((post) => ({
                  id: post?._id,
                  profileImage: post?.user?.profileImage,
                  username: post?.user?.userName,
                  universityName: post?.user?.university?.universityName,
                  universityAbbreviation: post?.user?.university?.universityAbbreviation,
                  content: post?.content,
                  likeCounter: post?.likeCounter,
                  repliesCounter: post?.replies?.length,
                  time: formatTimestamp(post?.createdAt)
                }))

                :

                response?.data?.taggedPeople?.map((post) => ({
                  profileImage: post?.profileImage,
                  username: post?.userName,
                  universityName: post?.university?.universityName
                }))

        }));
        setIsLoading(false);
      }
    }

  }

  const handleDeletePostComment = async (postId) => {
    setIsLoading(true);
    const response = await deleteComment({ id: postId });

    if (response?.success) {
      fetchData('Comments', true);
      toast?.success('Comment deleted successfully.')
    }
  }

  useEffect(() => {
    if (autoFetchedPostElement && post?._id) fetchData(autoFetchedPostElement);
  }, [autoFetchedPostElement, post?._id])

  return (
    <div className="post px-4">
      <div className="post-header">
        <img
          src={post?.user?.profileImage ? post?.user?.profileImage : dummy}
          alt="profile"
          className="profile-pic"
        />
        <div className="post-info">
          <span className="username">{post?.user?.userName}</span>
          <span className="post-time">
            {" "}
            · {post?.user?.university?.universityAbbreviation}
            {formatTimestamp(post?.createdAt)}
          </span>{" "}
          <br />
          <span className="post-location">
            Posted on {post?.user?.university?.universityName}
          </span>
        </div>
      </div>
      <div className="post-content">
        <p>
          {/* <Link to={`/users/detail/${post?.user?._id}`} className="mention">
            @mehmet_2323
          </Link>{" "} */}
          {post?.description}
        </p>
      </div>
      {(post?.imgurl?.length > 0 || post?.video?.length > 0) && (
        <div className="post-slider">
          <Slider {...settings}>
            {post?.imgurl?.map((img) => (
              <div className="image_container_slider">
                {img?.endsWith(".mp4") ? (
                  <video
                    src={img}
                    alt="slider"
                    className="slider-image"
                    controls
                  />
                ) : (
                  <img src={img} alt="slider" className="slider-image" />
                )}
              </div>
            ))}
            {post?.video?.map((video, index) => (
              <div className="image_container_slider" key={index}>
                <VideoPlayer src={video} />
              </div>
            ))}

          </Slider>
        </div>
      )}
      <div className="post-footer">
        <div className="post-actions">
          {/* <span className="likes" onClick={() => fetchData('Likes')}>
            {" "}
            {notLikedSvg(postData?.isType === 'Likes' && 'black')} {post?.likeCounter}
          </span> */}
          <span className="likes">
            {" "}
            {notLikedSvg(postData?.isType === 'Likes' && 'black')} {post?.likeCounter}
          </span>
          <span
            className="comments"
          // onClick={() => {
          //   setCommentClicked(!commentClicked);
          //   fetchData('Comments');
          // }}
          >
            {blackCommentSvg(postData?.isType === 'Comments' && 'black')} {post?.commentCount}
          </span>
          <span className="shares"
          //  onClick={() => fetchData('Tags')}
          >
            {TagSvg(postData?.isType === 'Tags' && 'black')} {post?.taggedPeopleCount}
          </span>
        </div>
      </div>

      <div className="px-3">

        {isLoading ?
          <div className="text-center"><ButtonLoader /></div>
          :
          postData?.isType ? postData?.data?.length !== 0 ? postData?.data?.slice(0, !fetchOverAllPostData && postData?.data?.length > 3 ? 3 : postData?.data?.length)?.map(
            (comment) =>
              <Comment
                data={{ ...comment, replyTo: post?.user?.userName }}
                name={postData?.isType}
                handleDeletePostComment={handleDeletePostComment}
              />
          ) :

            <div className="text-center mt-3 mb-1">No {postData?.isType}</div> : null
        }

        {!autoFetch && !fetchOverAllPostData && !isLoading && postData?.isType && postData?.data?.length > 3 && (

          <div className="mt-3">
            <button className="cursor-pointer border-0"
              style={{
                fontSize: '15px',
                fontWeight: '500',
                fontFamily: 'robotto',
                backgroundColor: 'transparent'
              }}
              onClick={() => navigate(`/user/posts/post-detail/${post?._id}`, { state: { type: postData?.isType } })}
            >Show more...
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePost;
