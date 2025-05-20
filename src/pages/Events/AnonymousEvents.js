import React, { useState } from "react";
import { getUserEvent } from "../../services/service.js";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";
// images png
import { useEffect } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { turkeyUniversitiesFilterOptions } from "../../Data/Data";
import DG from "../../atoms/DataTable/DataGrid";

const AllEvents = () => {
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

  const [event, setEvent] = useState();
  //const [User,setUser]=useState();
  const handlegetAnonEventData = async () => {
    setLoader(true);
    try {
      const response2 = await getUserEvent();
      //console.log( "check", response)
      if (response2?.success) {
        setEvent(response2?.data);
        setLoader(false);
        console.log("check 6", response2.data);

        //setUser(response?.data?.filter((User)=>User?._id==Id.Id)[0]);
        //console.log(response?.data?.filter((User)=>User?._id==Id.Id)[0])
      }
    } catch (error) {}
  };
  useEffect(() => {
    handlegetAnonEventData();
  }, []);

  return (
    <>
      <div className="row  px-2 pt-4">
        <div className="col-12  ">
          <div className="row d-flex align-items-end">
            <div className="col-12 ">
              <ListHeader
                mainHeading="Anonymous Events"
                placeholder="Search Title"
                btnText=""
                linkbtn=""
                linkBreadCrum="/events"
                blinkBreadCrumText="Event List"
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
              {/* <EventDataTable
                // rows={hospitalData}
                // setRows={setHospitalData}
                // loading={isLoading}
                searchQuery={searchQuery}
                title="Edit a Hospital"
              /> */}
              <DG
                index={4}
                loader={loader}
                getData={handlegetAnonEventData}
                data={event}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllEvents;
