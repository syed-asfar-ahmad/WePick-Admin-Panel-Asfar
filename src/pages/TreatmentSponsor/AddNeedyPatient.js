import Chevron from "../../assets/images/common/chevron-right.svg";
import AddNeedyPatientForm from "./../../components/treatmentsponsor/addneedypatientform/AddNeedyPatientForm";
import "../../assets/css/patients/addpatients/addpatientsheader.scss";

import AddRoleIcon from "../../assets/images/doctor/AddRoleIcon.svg";
import { useState } from "react";
import SponsorsList from "../../components/treatmentsponsor/addneedypatientform/SponsorsList";

const AddNeedyPatient = ({Id}) => {
  const [click, setClick] = useState(true);
  return (
    <>
      <div className="row px-3  pt-4 mb-4 addpatient-tab">
        <div className="col-12">
          <p className="mb-0 addpatient-heading"> {Id ? 'Edit': 'Add'} Needy Patient</p>
        </div>

        <div className="col-12 my-4">
          <div className="row ">
            <div className="col-lg-12 ">
              <p className="addpatient-breadcrumb">
                <span>DASHBOARD</span>
                <img src={Chevron} />
                <span> TREATMENT SPONSOR </span>
                <img src={Chevron} />
                <span className="current-tab">{Id ? 'Edit': 'Add'} NEEDY PATIENT </span>
              </p>
            </div>
          </div>
        </div>

        <div class="wrapper">
          <div class="row  m-0 first-row">
            <div class="col-lg-8 ">
              <div class="left-div">
                <AddNeedyPatientForm Id={Id}/>
              </div>
            </div>
            {/* <div class="col-lg-4 ">
              <div class="right-div">
                <SponsorsList />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNeedyPatient;
