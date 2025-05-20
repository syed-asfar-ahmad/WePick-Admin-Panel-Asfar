import React, { useState, useEffect } from "react";
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";
import "./University.scss";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import DG from "../../atoms/DataTable/DataGrid";
import { getUniversityData } from "../../services/service";
import CustomPagination from "../../atoms/CustomPagination";

const University = () => {
  const [universityData, setUniversityData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [totalUniversities, setTotalUniversities] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handlegetData = async (limit, page, query) => {
    setLoader(true);
    try {
      const response = await getUniversityData(page, limit, query);
      if (response?.success) {
        setUniversityData(response?.data);
        setTotalUniversities(response?.totalCount);
      }
    } catch (error) {
      console.error("Error fetching university data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    const debounceTimer = setTimeout(() => {
      handlegetData(itemsPerPage, currentPage, searchQuery);
    }, 500); // 500ms debounce time

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, itemsPerPage, currentPage]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="row  px-2 pt-4">
        <div className="col-12  ">
          <div className="row d-flex align-items-end">
            <div className="col-12">
              <ListHeader
                mainHeading="University"
                placeholder="Search Title"
                btnText="Add University"
                btnShow={true}
                linkbtn="/university/add"
                linkBreadCrum="/university"
                blinkBreadCrumText="Universities"
                handleSearchChange={handleSearchChange}
                searchShow={true}
                showLikeFilter={false}
                DropDown={false}
              />
            </div>
          </div>
        </div>

        <div className="col-12  ">
          <div className="row mb-5 pb-5">
            <div className="col-12 px-2 pt-4 mt-3">
              <DG
                loader={loader}
                data={universityData}
                index={1}
                getData={() =>
                  handlegetData(itemsPerPage, currentPage, searchQuery)
                }
              />
              <CustomPagination
                totalItems={totalUniversities}
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

export default University;
