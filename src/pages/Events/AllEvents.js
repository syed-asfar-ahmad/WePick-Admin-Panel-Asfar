import React, { useState, useEffect } from "react";
import { getUserEvent } from "../../services/service.js";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { eventListfilterOptions } from "../../Data/Data";
import DG from "../../atoms/DataTable/DataGrid";
import CustomPagination from "../../atoms/CustomPagination";

const AllEvents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [event, setEvent] = useState([]);
  const [loader, setLoader] = useState(false);
  const [filterOption, setFilterOption] = useState("All");
  const itemsPerPage = 10;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
    setCurrentPage(1);
  };

  const handleChangeSelect = (value) => {
    setSearchQuery(value.trim());
    setFilterOption(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlegetEventData = async (limit, page, search) => {
    setLoader(true);
    try {
      const response = await getUserEvent(limit, page, search);
      if (response?.success) {
        setEvent(response?.data);
        setTotalEvents(response?.pageInfo?.totalEventsCount);
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    const debounceTimer = setTimeout(() => {
      handlegetEventData(itemsPerPage, currentPage, searchQuery);
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
                mainHeading="Events"
                placeholder="Search Title"
                btnText=""
                linkbtn=""
                linkBreadCrum="/events"
                blinkBreadCrumText="Events"
                blinkBreadCrumText1="All"
                filterOptionData={eventListfilterOptions}
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
                index={4}
                loader={loader}
                getData={() =>
                  handlegetEventData(itemsPerPage, currentPage, searchQuery)
                }
                data={event}
              />
              <CustomPagination
                totalItems={totalEvents}
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

export default AllEvents;
