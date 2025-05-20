import React, { useState, useEffect } from "react";
import {
  getCommunity,
  getCustomCommunity,
  getOfficialCommunity,
  searchCommunity,
} from "../../services/service.js";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";

// images png
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { officialCommunityfilterOptions } from "../../Data/Data";
import DG from "../../atoms/DataTable/DataGrid";
import CustomPagination from "../../atoms/CustomPagination/index.jsx";

const OfficialCommunity = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [community, setCommunity] = useState();
  const [filterOption, setFilterOption] = useState("All");
  const [loader, setLoader] = useState(false);
  const [totalCommunities, setTotalCommunities] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlegetCommunityData = async (limit, page, filter = "All") => {
    setLoader(true);
    try {
      if (filterOption === "All") {
        const response = await getCommunity(limit, page, filter);
        if (response?.success) {
          setCommunity(response?.data);
          setTotalCommunities(response?.pagination?.totalCount);
          setLoader(false);
        }
      } else if (filterOption === "Official Community") {
        const response = await getOfficialCommunity(limit, page);
        if (response?.success) {
          setCommunity(response?.data);
          setTotalCommunities(response?.pagination?.totalCount);
          setLoader(false);
        }
      } else if (filterOption === "Custom Community") {
        const response = await getCustomCommunity(limit, page);
        if (response?.success) {
          setCommunity(response?.data);
          setTotalCommunities(response?.pagination?.totalCount);
          setLoader(false);
        }
      }
    } catch (error) {
      console.error("Error fetching community data:", error);
      setLoader(false);
    }
  };

  const handleSearchCommunities = async (query, limit, page) => {
    setLoader(true);
    try {
      const response = await searchCommunity(query, limit, page);
      if (response) {
        setCommunity(response?.data);
        const totalCommunities = response?.pagination?.totalCount;
        setTotalCommunities(totalCommunities);
      }
    } catch (error) {
      console.error("Error searching communities data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const debounceTimer = setTimeout(() => {
        handleSearchCommunities(searchQuery, itemsPerPage, currentPage);
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      handlegetCommunityData(itemsPerPage, currentPage);
    }
  }, [searchQuery, itemsPerPage, currentPage, filterOption]);

  const handleChangeSelect = (value) => {
    setFilterOption(value);
  };

  return (
    <>
      <div className="row px-1 pt-4">
        <div className="col-12">
          <div className="row d-flex align-items-end">
            <div className="col-12">
              <ListHeader
                mainHeading="Communities"
                placeholder="Search Communities by Name"
                btnText=""
                linkbtn=""
                linkBreadCrum="/officialcommunity"
                blinkBreadCrumText={`${
                  filterOption === "All"
                    ? "All Communities"
                    : filterOption === "Official Community"
                    ? "Official Community"
                    : filterOption === "Custom Community"
                    ? "Custom Community"
                    : ""
                }`}
                filterOptionData={officialCommunityfilterOptions}
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
            <div className="col-12 pt-4 mt-3">
              <DG
                index={7}
                loader={loader}
                getData={handlegetCommunityData}
                data={community}
              />
              <CustomPagination
                totalItems={totalCommunities}
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

export default OfficialCommunity;
