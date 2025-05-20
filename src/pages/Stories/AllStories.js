import React, { useState } from "react";
import { getStories, seacrhStories } from "../../services/service.js";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";

// images png
import { useEffect } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import DG from "../../atoms/DataTable/DataGrid";
import CustomPagination from "../../atoms/CustomPagination/index.jsx";
import { storiesfilterOptions } from "../../Data/Data";

const AllStories = () => {
  // const { data, isLoading, error } = useFetch(process.env.REACT_APP_GET_HOSPITAL_DATA);

  const [searchQuery, setSearchQuery] = useState("");
  const [totalStories, setTotalStories] = useState(0);
  const [filterOption, setFilterOption] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [stories, setStories] = useState();
  const [loader, setLoader] = useState(false);

  const itemsPerPage = 10;

  const handlegetStoriesData = async () => {
    setLoader(true);
    try {
      if (filterOption === "Public") {
        const response = await getStories();
        if (response?.success) {
          setStories(response?.data);
          setTotalStories(response?.totalCount);
          setLoader(false);
        }
      } else if (filterOption === "Anonymous") {
        const response = await getStories();
        if (response?.success) {
          setStories(response?.data);
          setTotalStories(response?.totalCount);
          setLoader(false);
        }
      } else {
        const response = await getStories();
        if (response?.success) {
          setStories(response?.data);
          setTotalStories(response?.totalCount);
          setLoader(false);
        }
      }
    } catch (error) {
      console.log("error fetching stories");
      setLoader(false);
    }
  };

  const handleSearchStories = async (query, page, limit) => {
    setLoader(true);
    try {
      const response = await seacrhStories(query, page, limit);
      if (response) {
        console.log("search response", response?.data);
        setStories(response?.data);
        setTotalStories(response?.pagination?.totalCount);
      }
    } catch (error) {
      console.error("Error searching user data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const debounceTimer = setTimeout(() => {
        handleSearchStories(searchQuery, itemsPerPage, currentPage);
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else {
      handlegetStoriesData(itemsPerPage, currentPage);
    }
  }, [searchQuery, itemsPerPage, currentPage, filterOption]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    handlegetStoriesData();
  }, []);

  const handleChangeSelect = (value) => {
    setFilterOption(value);
  };
  return (
    <>
      <div className="row  px-2 pt-4">
        <div className="col-12  ">
          <div className="row d-flex align-items-end">
            <div className="col-12 ">
              <ListHeader
                mainHeading="Stories"
                placeholder="Search user by username"
                linkBreadCrum="/stories"
                blinkBreadCrumText="Stories"
                blinkBreadCrumText1={`${
                  filterOption === "All"
                    ? "All"
                    : filterOption === "Public"
                    ? "Public Stories"
                    : filterOption === "Anonymous"
                    ? "Private Stories"
                    : ""
                }`}
                filterOptionData={storiesfilterOptions}
                filterOption={filterOption}
                setFilterOption={setFilterOption}
                handleSearchChange={handleSearchChange}
                handleChangeSelect={handleChangeSelect}
                searchShow={true}
                DropDown={true}
              />
            </div>
          </div>
        </div>

        <div className="col-12  ">
          <div className="row mb-5 pb-5">
            <div className="col-12 px-2 pt-4 mt-3">
              {/* <AllStoriesDataTable
                // rows={hospitalData}
                // setRows={setHospitalData}
                // loading={isLoading}
                searchQuery={searchQuery}
                title="Edit a Hospital"
              /> */}
              <DG
                index={8}
                getData={handlegetStoriesData}
                loader={loader}
                data={stories}
              />
              <CustomPagination
                totalItems={totalStories}
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

export default AllStories;
