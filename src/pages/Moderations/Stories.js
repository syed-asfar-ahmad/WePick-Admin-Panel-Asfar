import React, { useState, useEffect } from "react";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { storiesfilterOptions } from "../../Data/Data";
import DG from "../../atoms/DataTable/DataGrid";
import CustomPagination from "../../atoms/CustomPagination";
import { getModerationStories } from "../../services/service";

const Stories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStories, setTotalStories] = useState(0);
  const [stories, setStories] = useState([]);
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

  const handlegetStoriesData = async (limit, page, query) => {
    setLoader(true);
    try {
      const response = await getModerationStories(limit, page, query);
      if (response?.success) {
        setStories(response?.data);
        setTotalStories(response?.pagination?.totalItems);
      }
    } catch (error) {
      console.error("Error fetching stories data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    const debounceTimer = setTimeout(() => {
      handlegetStoriesData(itemsPerPage, currentPage, searchQuery);
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
                mainHeading="All Stories"
                placeholder="Search stories by username"
                linkBreadCrum="/moderation/posts"
                blinkBreadCrumText="Moderation"
                blinkBreadCrumText1="Stories"
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
                index={13}
                loader={loader}
                getData={() =>
                  handlegetStoriesData(itemsPerPage, currentPage, searchQuery)
                }
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

export default Stories;
