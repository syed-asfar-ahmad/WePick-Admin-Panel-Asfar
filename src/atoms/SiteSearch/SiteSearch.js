import React from "react";
import SearchIcon from "../../assets/images/dashboard/SearchIcon.svg";

const SiteSearch = () => {
  return (
    <div className="header-search d-flex align-items-center">
      <input type="text" className="ml-3" placeholder="Search Keywords" />
      <img src={SearchIcon} className=" mx-3" alt="" />
    </div>
  );
};

export default SiteSearch;
