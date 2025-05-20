import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUser, seacrhUser } from "../../services/service.js";
import "./user.scss";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import DG from "../../atoms/DataTable/DataGrid";
import CustomPagination from "../../atoms/CustomPagination/index.jsx";
import crumbs from "../../services/crumbs.js";
import { UsersfilterOptions } from "../../Data/Data.js";

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState("All");
  const itemsPerPage = 10;

  const handleChangeSelect = (value) => {
    setFilterOption(value);
    setCurrentPage(1);
    handleSearchUser(value.trim(), 1, itemsPerPage, true);
  };
  const handlegetUserData = async (limit, page) => {
    setLoader(true);
    try {
      const response = await getUser(page, limit);
      if (response) {
        setUser(response?.data);
        setTotalUsers(response?.pagination.totalCount);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleSearchUser = async (query, page, limit, isPublic = false) => {
    setLoader(true);
    try {
      const response = await seacrhUser(query, page, limit, isPublic);
      if (response) {
        console.log("search response", response?.data);
        setUser(response?.data);
        setTotalUsers(response?.pagination.totalCount);
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
        const isPublic = filterOption === "Public";
        handleSearchUser(searchQuery, currentPage, itemsPerPage, isPublic);
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else {
      handlegetUserData(itemsPerPage, currentPage);
    }
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
      <div className="row px-2 pt-4">
        <div className="col-12">
          <div className="row d-flex align-items-end">
            <div className="col-12">
              <ListHeader
                mainHeading="Users"
                placeholder="Search user by name, email, university or course"
                breadCrumbItems={crumbs?.users}
                handleChangeSelect={handleChangeSelect}
                handleSearchChange={handleSearchChange}
                filterOptionData={UsersfilterOptions}
                filterOption={filterOption}
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
                index={0}
                loader={loader}
                getData={() => handlegetUserData(itemsPerPage, currentPage)}
                data={user}
              />
              <CustomPagination
                totalItems={totalUsers}
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

export default UsersPage;
