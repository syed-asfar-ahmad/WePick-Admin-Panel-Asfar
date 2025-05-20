import React, { useState, useEffect } from "react";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { storiesfilterOptions } from "../../Data/Data";
import DG from "../../atoms/DataTable/DataGrid";
import CustomPagination from "../../atoms/CustomPagination";
import { getModerationPosts, getReportDetails } from "../../services/service";
import { useLocation, useParams } from "react-router-dom";

const ReportView = () => {
  const location = useLocation();
  const { row, backRoute } = location.state || {};
  const entityType = row?.report?.[0]?.entityType;
  const entityId = row?.report?.[0]?.entityId;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [report, setReport] = useState([]);
  const [loader, setLoader] = useState(false);
  const [filterOption, setFilterOption] = useState("All");
  const itemsPerPage = 10;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
    setCurrentPage(1);
  };

  const handleChangeSelect = (value) => {
    setFilterOption(value);
    setCurrentPage(1);
  };
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlegetReportsData = async (id, type) => {
    setLoader(true);
    try {
      const response = await getReportDetails(id, type);
      if (response?.success) {
        setReport(response?.data);
        // setTotalPosts(response?.pagination?.totalItems);
      }
    } catch (error) {
      console.error("Error fetching posts data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    handlegetReportsData(entityId, entityType);
  }, [entityId, entityType]);

  return (
    <>
      <div className="row px-2 pt-4">
        <div className="col-12">
          <div className="row d-flex align-items-end">
            <div className="col-12">
              <ListHeader
                mainHeading="Reports"
                placeholder="Search Title"
                btnText=""
                linkbtn=""
                linkBreadCrum="/moderation/posts"
                linkBreadCrum1={`/moderation/${backRoute}`}
                blinkBreadCrumText="Moderation"
                blinkBreadCrumText1={capitalizeFirstLetter(backRoute)}
                blinkBreadCrumText2="Reports"
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
              <DG index={18} loader={loader} data={report} />
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

export default ReportView;
