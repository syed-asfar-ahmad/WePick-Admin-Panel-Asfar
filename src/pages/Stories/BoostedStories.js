import React, { useState } from "react";
import { boostedStory } from "../../services/service.js";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";
// images png
import { useEffect } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import DG from "../../atoms/DataTable/DataGrid";

const BoostedStories = () => {
  // const { data, isLoading, error } = useFetch(process.env.REACT_APP_GET_HOSPITAL_DATA);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
  };

  // console.log('data', data)

  const [bstories, setBStories] = useState();
  const [loader, setLoader] = useState(false);

  //const [User,setUser]=useState();
  const handlegetBStoriesData = async () => {
    setLoader(true);
    try {
      const response3 = await boostedStory();
      //console.log( "check", response)
      if (response3?.success) {
        setBStories(response3?.data);
        setLoader(false);
        console.log("bstories", response3.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handlegetBStoriesData();
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
                mainHeading="Boosted Stories"
                placeholder="Search Title"
                btnText=""
                linkbtn=""
                linkBreadCrum="/boostedstories"
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
              {/* <BoostedStoriesDataTable
                // rows={hospitalData}
                // setRows={setHospitalData}
                // loading={isLoading}
                searchQuery={searchQuery}
                title="Edit a Hospital"
              /> */}
              <DG
                index={9}
                getData={handlegetBStoriesData}
                loader={loader}
                data={bstories}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoostedStories;
