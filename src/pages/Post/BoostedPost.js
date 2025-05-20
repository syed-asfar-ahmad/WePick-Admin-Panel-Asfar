import React, { useState } from "react";
import { boostedPost } from "../../services/service.js";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";

// images png
import { useEffect } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { turkeyUniversitiesFilterOptions } from "../../Data/Data";
import DG from "../../atoms/DataTable/DataGrid";

const BoostedPosts = () => {
  // const { data, isLoading, error } = useFetch(process.env.REACT_APP_GET_HOSPITAL_DATA);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
  };
  const handleChangeSelect = (value) => {
    setFilterOption(value);
  };
  // console.log('data', data)
  const [loader, setLoader] = useState(false);

  const [bposts, setBposts] = useState();
  //const [User,setUser]=useState();
  const handlegetBpostData = async () => {
    setLoader(true);
    try {
      const response = await boostedPost();
      //console.log( "check", response)
      if (response?.success) {
        setBposts(response?.data);
        setLoader(false);
        console.log("checkbpost", response.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handlegetBpostData();
  }, []);

  return (
    <>
      <div className="row  px-2 pt-4">
        <div className="col-12  ">
          <div className="row d-flex align-items-end">
            <div className="col-12 ">
              <ListHeader
                mainHeading="Boosted Posts"
                placeholder="Search Title"
                btnText=""
                linkbtn=""
                linkBreadCrum="/allpost"
                blinkBreadCrumText="Post List"
                filterOptionData={turkeyUniversitiesFilterOptions}
                filterOption={filterOption}
                handleChangeSelect={handleChangeSelect}
                handleSearchChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="col-12  ">
          <div className="row mb-5 pb-5">
            <div className="col-12 px-2 pt-4 mt-3">
              {/* <BoostedPostDataTable
                // rows={hospitalData}
                // setRows={setHospitalData}
                // loading={isLoading}
                searchQuery={searchQuery}
                title="Edit a Hospital"
              /> */}
              <DG
                index={3}
                loader={loader}
                getData={handlegetBpostData}
                data={bposts}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoostedPosts;
