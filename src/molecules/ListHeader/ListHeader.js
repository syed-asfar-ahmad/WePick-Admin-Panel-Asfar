import React from "react";
// import Searchbar from "../../components/common/Searchbar";
import BreadCrum from "../../atoms/breadcrum/BreadCrum";
import { Link } from "react-router-dom";
// import { CSVLink, CSVDownload } from "react-csv";
import "../../assets/css/blooddonation.scss";
// import { useState } from "react";
// import DownIcon from "../../assets/images/dashboard/DownIcon.svg";
import CustomDropDown from "../../atoms/CustomDropDown/Index";
import { FilterIcon } from "../../assets/icons";

const ListHeader = ({
  handleSearchChange,
  mainHeading,
  placeholder,
  btnText,
  linkBreadCrum,
  linkBreadCrum1,
  blinkBreadCrumText,
  linkbtn,
  csvData,
  disabled,
  exportFileName,
  blinkBreadCrumText1,
  blinkBreadCrumText2,
  filterOption,
  handleChangeSelect,
  filterOptionData,
  btnShow,
  searchShow,
  showLikeFilter,
  onShowLikeFilterClick,
  DropDown,
  breadCrumbItems,
  showlikeWiseFilter,
  filterLikeWiseOption,
  likeWiseFilterChangeSelect
}) => {
  return (
    <div className="row mb-1">
      <div
        className="col-12 mb-2 blooddonation-breadcrumb"
        style={{ fontSize: "16px", color: "#202020", fontWeight: "500" }}
      >
        {mainHeading}
      </div>
      <div className="col-lg-5">
        <BreadCrum
          firstLink={linkBreadCrum}
          firstText={blinkBreadCrumText}
          secondLink={linkBreadCrum1}
          secondText={blinkBreadCrumText1}
          thirdText={blinkBreadCrumText2}
          breadCrumbItems={breadCrumbItems}
        />
      </div>

      <div className="col-lg-7 d-flex justify-content-end align-items-center list-header pr-0">
        {searchShow && (
          <div className="search-input-field d-flex align-items-center mr-2">
            <i
              className="fas fa-search pl-2"
              style={{ color: "#6D7482", fontSize: "14.5px" }}
            ></i>
            <input
              onChange={(e) => handleSearchChange(e)}
              type="text"
              placeholder={placeholder}
              className="pl-2"
            />
          </div>
        )}
        {showLikeFilter && (
          <>
            <div
              className="ml-auto cursor-pointer"
              onClick={onShowLikeFilterClick}
            >
              {FilterIcon}
            </div>
          </>
        )}
        {DropDown && (
          <div style={{ width: "200px" }}>
            <CustomDropDown
              value={filterOption}
              selectLabel="Select"
              handleChangeSelect={handleChangeSelect}
              option={filterOptionData}
            />
          </div>
        )}
        {showlikeWiseFilter && (
          <div className="ml-2" style={{ width: "200px" }}>
            <CustomDropDown
              value={filterLikeWiseOption}
              selectLabel="Select"
              handleChangeSelect={likeWiseFilterChangeSelect}
              option={filterOptionData}
            />
          </div>
        )}
        {showLikeFilter && (
          <div className="col-lg-4 pr-lg-1 pb-1">
            <CustomDropDown
              value={filterOption}
              selectLabel="Select"
              handleChangeSelect={handleChangeSelect}
              option={filterOptionData}
            />
          </div>
        )}
        {btnText ? (
          true || btnShow === true ? (
            <Link to={linkbtn}>
              <button className="list-header-btn2 ml-2  d-flex align-items-center mr-2">
                <i className="fa-solid fa-circle-plus pr-2 pt-0"></i>
                {btnText}
              </button>
            </Link>
          ) : null
        ) : null}
      </div>
    </div>
  );
};

export default ListHeader;
