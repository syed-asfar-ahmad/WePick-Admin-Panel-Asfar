import React, { useState, useEffect } from "react";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { storiesfilterOptions } from "../../Data/Data";
import DG from "../../atoms/DataTable/DataGrid";
import CustomPagination from "../../atoms/CustomPagination";
import { getModerationPosts } from "../../services/service";
import crumbs from "../../services/crumbs";

const Posts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [filterOption, setFilterOption] = useState("All");
  const itemsPerPage = 10;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
    setCurrentPage(1);
  };

  const handleChangeSelect = (value) => {
    setFilterOption(value);
    setSearchQuery(value.trim());
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlegetPostsData = async (limit, page, query) => {
    setLoader(true);
    try {
      const response = await getModerationPosts(limit, page, query);
      if (response?.success) {
        setPosts(response?.data);
        setTotalPosts(response?.pagination?.totalItems);
      }
    } catch (error) {
      console.error("Error fetching posts data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    const debounceTimer = setTimeout(() => {
      handlegetPostsData(itemsPerPage, currentPage, searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, currentPage, itemsPerPage]);

  return (
    <>
      <div className="row px-2 pt-4">
        <div className="col-12">
          <div className="row d-flex align-items-end">
            <div className="col-12">
              <ListHeader
                mainHeading="Posts"
                placeholder="Search posts by username"
                breadCrumbItems={crumbs?.moderationPosts}
                filterOptionData={storiesfilterOptions}
                filterOption={filterOption}
                handleChangeSelect={handleChangeSelect}
                handleSearchChange={handleSearchChange}
                searchShow={true}
                DropDown={true}
              />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="row mb-5 pb-5">
            <div className="col-12 px-2 pt-4 mt-3">
              <DG
                index={11}
                loader={loader}
                getData={() =>
                  handlegetPostsData(itemsPerPage, currentPage, searchQuery)
                }
                data={posts}
              />
              <CustomPagination
                totalItems={totalPosts}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Posts;
