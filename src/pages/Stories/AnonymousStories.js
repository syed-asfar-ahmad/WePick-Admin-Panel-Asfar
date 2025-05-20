import React, { useState } from "react";
import { getStories } from "../../services/service.js";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";
// images png
import { useEffect } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import DG from "../../atoms/DataTable/DataGrid";

const AllStories = () => {
  // const { data, isLoading, error } = useFetch(process.env.REACT_APP_GET_HOSPITAL_DATA);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
  };

  // console.log('data', data)
  const [stories, setStories] = useState();
  const [loader, setLoader] = useState(false);

  //const [User,setUser]=useState();
  const handlegetAnonyStoriesData = async () => {
    setLoader(true);
    try {
      const response3 = await getStories();
      //console.log( "check", response)
      if (response3?.success) {
        setStories(response3?.data);
        setLoader(false);
        console.log("check89", response3.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handlegetAnonyStoriesData();
  }, []);

  const filterOptionData = [
    {
      id: 0,
      text: "All",
    },
    {
      id: 1,
      text: "Today",
    },
    {
      id: 2,
      text: "Tomorrow",
    },
    {
      id: 3,
      text: "Yesterday",
    },
  ];
  return (
    <>
      <div className="row  px-2 pt-4">
        <div className="col-12  ">
          <div className="row d-flex align-items-end">
            <div className="col-12 ">
              <ListHeader
                mainHeading="Anonymous Stories"
                placeholder="Search Title"
                btnText=""
                linkbtn=""
                linkBreadCrum="/anonymousstories"
                blinkBreadCrumText="Story List"
                filterOptionData={filterOptionData}
                filterOption={filterOption}
                setFilterOption={setFilterOption}
                handleSearchChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="col-12  ">
          <div className="row mb-5 pb-5">
            <div className="col-12 px-2 pt-4 mt-3">
              {/* <AllStoriesDataTable
                // rows={hospitalData}
                // setRows={setHospitalData}
                // loading={isLoading}
                searchQuery={searchQuery}
                title="Edit a Hospital"
              /> */}
              <DG
                index={10}
                getData={handlegetAnonyStoriesData}
                loader={loader}
                data={stories}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllStories;
