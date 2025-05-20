import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { getQuestions, seacrhQuestions} from "../../services/service.js";
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";

import ListHeader from "../../molecules/ListHeader/ListHeader";
import { storiesfilterOptions } from "../../Data/Data";
import DG from "../../atoms/DataTable/DataGrid";
import CustomPagination from "../../atoms/CustomPagination/index.jsx";
import { getModerationComments } from "../../services/service.js";

const Comments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [comments, setComments] = useState([]);
  const [loader, setLoader] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handlegetCommentsData = async (limit, page, query) => {
    setLoader(true);
    try {
      const response = await getModerationComments(limit, page, query);
      if (response?.success) {
        setComments(response?.data);
        setTotalComments(response?.pagination?.totalItems);
      }
    } catch (error) {
      console.error("Error fetching comments data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    const debounceTimer = setTimeout(() => {
      handlegetCommentsData(itemsPerPage, currentPage, searchQuery);
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
                mainHeading="Comments"
                placeholder="Search comments by username"
                linkBreadCrum="#"
                blinkBreadCrumText="Moderation"
                blinkBreadCrumText1="Comments"
                filterOptionData={storiesfilterOptions}
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
                index={17}
                loader={loader}
                getData={() =>
                  handlegetCommentsData(itemsPerPage, currentPage, searchQuery)
                }
                data={comments}
              />
              <CustomPagination
                totalItems={totalComments}
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

export default Comments;
