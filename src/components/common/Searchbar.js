import React from "react";
import "../../assets/css/common/common.scss";

const Searchbar = ({ onChange, value, placeholder="Search by Name or Civil ID" }) => {
  return (
    <div className="search-field">
      <input
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default Searchbar;
