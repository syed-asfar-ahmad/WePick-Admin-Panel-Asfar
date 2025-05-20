import React, { useState } from "react";

// css file
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";
// images png
import ListHeader from "../../molecules/ListHeader/ListHeader";
import BoostedPostDataTable from "../../components/Post/BoostedPostDataTable";

const BoostedPosts = () => {
  // const { data, isLoading, error } = useFetch(process.env.REACT_APP_GET_HOSPITAL_DATA);

  const [searchQuery, setSearchQuery] = useState("");
  // console.log('data', data)

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
                blinkBreadCrumText="Post LIST"
              />
            </div>
          </div>
        </div>

        <div className="col-12  ">
          <div className="row mb-5 pb-5">
            <div className="col-12 px-2 pt-4 mt-3">
              <BoostedPostDataTable
                // rows={hospitalData}
                // setRows={setHospitalData}
                // loading={isLoading}
                searchQuery={searchQuery}
                title="Edit a Hospital"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoostedPosts;
