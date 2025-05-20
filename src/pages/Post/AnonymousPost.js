import React, { useState } from "react";
import { getPostData } from "../../services/service.js";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";

// images png
import { useEffect } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { turkeyUniversitiesFilterOptions } from "../../Data/Data";
import DG from "../../atoms/DataTable/DataGrid";

const AllPosts = () => {
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

  const [posts, setPosts] = useState();
  //const [User,setUser]=useState();
  const handlegetAnonUserData = async () => {
    setLoader(true);
    try {
      const response = await getPostData();
      //console.log( "check", response)
      if (response?.success) {
        setPosts(response?.data);
        setLoader(false);
        console.log("check", response.data);

        //setUser(response?.data?.filter((User)=>User?._id==Id.Id)[0]);
        //console.log(response?.data?.filter((User)=>User?._id==Id.Id)[0])
      }
    } catch (error) {}
  };
  console.log("check 3", posts);
  useEffect(() => {
    handlegetAnonUserData();
  }, []);

  return (
    <>
      <div className="row  px-2 pt-4">
        <div className="col-12  ">
          <div className="row d-flex align-items-end">
            <div className="col-12 ">
              <ListHeader
                mainHeading="Anonymous Posts"
                placeholder="Search Title"
                btnText=""
                linkbtn=""
                linkBreadCrum="/anonymouspost"
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
              {/* <AllPostData
                // rows={hospitalData}
                // setRows={setHospitalData}
                // loading={isLoading}
                searchQuery={searchQuery}
                title="Edit a Hospital"
              /> */}
              <DG
                index={2}
                loader={loader}
                getData={handlegetAnonUserData}
                data={posts}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPosts;
