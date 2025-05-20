import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { getPostData, seacrhPosts } from "../../services/service.js";
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";

import ListHeader from "../../molecules/ListHeader/ListHeader";
import { postfilterOptions } from "../../Data/Data";
import DG from "../../atoms/DataTable/DataGrid";
import CustomPagination from "../../atoms/CustomPagination/index.jsx";
import crumbs from "../../services/crumbs.js";

const AllPosts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleChangeSelect = (value) => {
    setFilterOption(value);
    setCurrentPage(1);
    handlegetPostsData(itemsPerPage, 1, value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlegetPostsData = async (limit, page, filter = "All") => {
    setLoader(true);
    try {
      const response = await getPostData(limit, page, { search: filter });
      if (response?.success) {
        setPosts(response?.data);
        const totalPostsCount = response?.pageInfo?.totalPostsCount || 0;
        console.log("Total Posts Count:", totalPostsCount);
        setTotalPosts(totalPostsCount);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleSearchPosts = async (query, page, limit) => {
    setLoader(true);
    try {
      const response = await seacrhPosts(query, page, limit);
      if (response) {
        setPosts(response?.data);
        const totalPostsCount = response?.pageInfo?.totalPostsCount;
        setTotalPosts(totalPostsCount);
      }
    } catch (error) {
      console.error("Error searching posts data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const debounceTimer = setTimeout(() => {
        handleSearchPosts(searchQuery, currentPage, itemsPerPage);
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else {
      handlegetPostsData(itemsPerPage, currentPage, filterOption);
    }
  }, [searchQuery, itemsPerPage, currentPage]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
    setCurrentPage(1);
  };

  // useEffect(() => {
  //   console.log("THIS");
  //   handlegetPostsData(itemsPerPage, currentPage);
  // }, [currentPage, itemsPerPage]);

  return (
    <>
      <div className="row px-2 pt-4">
        <div className="col-12">
          <div className="row d-flex align-items-end">
            <div className="col-12">
              <ListHeader
                mainHeading="Posts"
                placeholder="Search posts by name"
                breadCrumbItems={crumbs?.posts}
                filterOptionData={postfilterOptions}
                filterOption={filterOption}
                searchShow={true}
                handleChangeSelect={handleChangeSelect}
                handleSearchChange={handleSearchChange}
                DropDown={true}
              />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="row mb-5 pb-5">
            <div className="col-12 px-2 pt-4 mt-3">
              <DG
                index={2}
                loader={loader}
                getData={() => handlegetPostsData(itemsPerPage, currentPage, filterOption)}
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

export default AllPosts;
