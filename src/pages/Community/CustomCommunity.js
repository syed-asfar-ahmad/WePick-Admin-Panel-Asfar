import React, { useState } from "react";
import { getWithdrawalRequests } from "../../services/service.js";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";

// components

// img svg

// images png
import { useEffect } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { customComunityilterOptions } from "../../Data/Data";
import DG from "../../atoms/DataTable/DataGrid";
import CustomPagination from "../../atoms/CustomPagination/index.jsx";

const CustomComunity = () => {
  // const { data, isLoading, error } = useFetch(process.env.REACT_APP_GET_HOSPITAL_DATA);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [totalCommunities, setTotalCommunities] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterState, setFilterState] = useState({
    actionOnTable: false,
    reLoadTableData: false,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
  };

  const [loader, setLoader] = useState(false);

  // console.log('data', data)
  const [customCCommunity, setCustomCommunity] = useState();

  const handlegetCustomCommunityData = async () => {
    setCustomCommunity('')
    setLoader(true);
    try {
      const response = await getWithdrawalRequests(
        currentPage,
        itemsPerPage,
        searchQuery
      );
      if (response?.success) {
        setCustomCommunity(response?.requests);
        setTotalCommunities(response?.pagination?.totalCount || 10);
        setLoader(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handlegetCustomCommunityData();
  }, [currentPage, filterState?.reLoadTableData]);

  useEffect(() => {
    if (currentPage === 1) {
      setFilterState({
        ...filterState,
        reLoadTableData: !filterState?.reLoadTableData,
      });
    } else {
      setCurrentPage(1);
    }
  }, [filterState?.actionOnTable, searchQuery]);

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
                mainHeading="Withdrawal Requests"
                placeholder="Search by username"
                btnText=""
                linkbtn=""
                linkBreadCrum="/withdrawalrequests"
                blinkBreadCrumText="Withdrawal Requests"
                filterOptionData={customComunityilterOptions}
                filterOption={filterOption}
                handleChangeSelect={handleChangeSelect}
                handleSearchChange={handleSearchChange}
                searchShow={true}
              />
            </div>
          </div>
        </div>

        <div className="col-12  ">
          <div className="row mb-5 pb-5">
            <div className="col-12 px-2 pt-4 mt-3">
              <DG
                index={6}
                loader={loader}
                getData={handlegetCustomCommunityData}
                data={customCCommunity}
                setFilterState={setFilterState}
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

export default CustomComunity;
