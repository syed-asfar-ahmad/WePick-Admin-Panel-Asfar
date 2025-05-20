import InfiniteScroll from "react-infinite-scroll-component";
import React, { useEffect, useState } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { getUserPosts } from "../../services/service";
import "../../assets/css/post.scss";
import SinglePost from "../../components/Post/SinglePost";
import { useParams } from "react-router-dom";
import { Divider, Skeleton } from "antd";
import ButtonLoader from "../../atoms/buttonLoader";
import crumbs from "../../services/crumbs";

const PostDetail = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handlegetPostsData = async (id, page, limit) => {
    try {
      setIsLoading(true);
      const response = await getUserPosts(id, page, limit);

      if (response.success) {
        const newPosts = response.data;
        setIsLoading(false);
        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handlegetPostsData(id, page, 10);
  }, [id, page]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="row px-2 pt-4">
      <div className="col-12">
        <div className="row d-flex align-items-end">
          <div className="col-12">
            <ListHeader
              mainHeading="User Posts"
              placeholder="Search user by name, email, university or course"
              breadCrumbItems={crumbs?.userPosts}
              searchShow={false}
            />
          </div>
        </div>
      </div>

      <div
        className="col-12 px-0 mt-3 remove-x-overflow-doc-list"
        id="scrollableDiv"
        style={{
          width: "100%",
          height: "76vh",
          overflow: "auto",
          overflowX: "hidden",
        }}
      >

        {posts?.length !== 0 ?
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            scrollableTarget="scrollableDiv"
            >
            {posts.map((post, index) => (
              <SinglePost key={index} post={post} />
            ))}
          </InfiniteScroll>

            :

          <div className="d-flex justify-content-center align-items-center" style={{ height: '100%'}}>{isLoading ? <ButtonLoader /> : 'No data found'}</div>
        }

      </div>
    </div>
  );
};

export default PostDetail;
