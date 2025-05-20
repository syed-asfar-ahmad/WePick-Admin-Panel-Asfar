import React, { useState, useEffect } from "react";
import { getBoosts } from "../../services/service.js";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { boostsOption, boostsLikeWiseOption } from "../../Data/Data";
import DG from "../../atoms/DataTable/DataGrid";
import CustomPagination from "../../atoms/CustomPagination";

const Boost = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBoosts, setTotalBoosts] = useState(0);
  const [boosts, setBoosts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [filterOption, setFilterOption] = useState("all");
  const [filterLikeWiseOption, setFilterLikeWiseOption] = useState("All");
  const itemsPerPage = 10;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleChangeSelect = (value) => {
    setFilterOption(value);
    setCurrentPage(1);
  };

  const likeWiseFilterChangeSelect = (value) => {
    setFilterLikeWiseOption(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleGetEventData = async (type, page, limit, search) => {
    setLoader(true);
    try {
      const response = await getBoosts(type, page, limit, search);
      if (response) {
        setBoosts(response?.data);
        setTotalBoosts(response?.pagination?.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const trimmedSearchQuery = searchQuery.trim();
    const debounceTimer = setTimeout(() => {
      handleGetEventData(filterOption, currentPage, itemsPerPage, trimmedSearchQuery || filterLikeWiseOption);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filterLikeWiseOption, currentPage, itemsPerPage, filterOption]);

  return (
    <div className="row px-2 pt-4">
      <div className="col-12">
        <ListHeader
          mainHeading="Boost"
          placeholder="Search by Username"
          linkBreadCrum="/boost"
          blinkBreadCrumText="Boosts"
          blinkBreadCrumText1={
            filterOption === "all"
              ? "All"
              : filterOption === "post"
              ? "Posts"
              : filterOption === "story"
              ? "Stories"
              : filterOption === "event"
              ? "Events"
              : ""
          }
          filterOptionData={boostsOption}
          filterOption={filterOption}
          handleChangeSelect={handleChangeSelect}
          handleSearchChange={handleSearchChange}
          searchShow={true}
          DropDown={true}
          showlikeWiseFilter={true}
          boostsLikeWiseOption={boostsLikeWiseOption}
          filterLikeWiseOption={filterLikeWiseOption}
          likeWiseFilterChangeSelect={likeWiseFilterChangeSelect}
        />
      </div>

      <div className="col-12">
        <div className="row mb-5 pb-5">
          <div className="col-12 px-2 pt-4 mt-3">
            <DG loader={loader} data={boosts} />
            <CustomPagination
              totalItems={totalBoosts}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boost;
