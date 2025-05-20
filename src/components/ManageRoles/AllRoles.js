import { useState } from "react";
import DoctorDataTable from "../../components/doctors/DoctorDataTable";
import PharmacyDataTable from "../../components/Pharmacy/PharmacyDataTable";
import "../../assets/css/doctor.scss";
import "../../assets/css/pharmacy.scss";
import { Button, Modal, Rate, Select, Slider } from "antd";

// img svg
import RightArrow from "../../assets/images/doctor/RightArrow.svg";
import FilterIcon from "../../assets/images/doctor/FilterIcon.svg";
import DownTriIcon from "../../assets/images/doctor/DownTriIcon.svg";
import { Link } from "react-router-dom";
import CustomSelect from "../../components/common/CustomSelect";
import Searchbar from "../../components/common/Searchbar";
import AllRolesDataTables from "./AllRolesDataTables";
import AddRoleModal from "../../molecules/AddRoleModal/AddRoleModal";
import useFetch from "../../customHook/useFetch";

const AllRoles = () => {
  const [rows, setRows] = useState([
    {
      number: 1,
      name: "Sohaib Butt",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-25",
      time: "11:00AM",
      civilID: "40122-67366475-3",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Pending",
      prescription: "Aspirin 500mg",
    },
    {
      number: 2,
      name: "Abdullah",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-25",
      time: "11:00AM",
      civilID: "40122-67366475-4",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Pending",
      prescription: "Aspirin 500mg",
    },
    {
      number: 3,
      name: "Ahad",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-25",
      time: "11:00AM",
      civilID: "40122-67366475-5",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Pending",
      prescription: "Aspirin 500mg",
    },
    {
      number: 4,
      name: "Azlan",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-25",
      time: "11:00AM",
      civilID: "40122-67366475-6",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Pending",
      prescription: "Aspirin 500mg",
    },
    {
      number: 5,
      name: "Ayan",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-25",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Pending",
      prescription: "Aspirin 500mg",
    },
    {
      number: 6,
      name: "Sohaib",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-26",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Pending",
      prescription: "Aspirin 500mg",
    },
    {
      number: 7,
      name: "Caliph",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-26",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
    {
      number: 8,
      name: "Johnson",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-26",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
    {
      number: 9,
      name: "William",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-26",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
    {
      number: 10,
      name: "Sufiyan",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-26",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
    {
      number: 11,
      name: "Malok",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-26",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
    {
      number: 12,
      name: "Asad",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-26",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "pending",
      prescription: "Aspirin 500mg",
    },
    {
      number: 13,
      name: "Umair",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-26",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
    {
      number: 14,
      name: "Dan",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-26",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
    {
      number: 15,
      name: "Dan",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-26",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
    {
      number: 16,
      name: "Dan",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-24",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
    {
      number: 17,
      name: "Dan",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-24",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
    {
      number: 18,
      name: "Dan",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-24",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
    {
      number: 19,
      name: "Dan",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-24",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
    {
      number: 20,
      name: "Sameer",
      email: "johndoe@example.com",
      age: 35,
      gender: "male",
      specialization: "Cardiology",
      date: "2023-03-24",
      time: "11:00AM",
      civilID: "40122-67366475-7",
      doctor: "Dr. Jane Smith",
      fees: "$50/Patient",
      appointmentStatus: "Approved",
      prescription: "Aspirin 500mg",
    },
  ]);

  const [filterOption, setFilterOption] = useState("today"); // default to "today"
  const [searchQuery, setSearchQuery] = useState("");

  //  Filter handler
  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  // Search Functionality
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
  };

  const [modal2Open, setModal2Open] = useState(false);
  const [modal1Open, setModal1Open] = useState(false);

  const marks = {
    // 0: '0°C',
    15: "0 Km",
    65: "500 km",
    100: {
      style: {
        color: "#f50",
      },
      // label: <strong>100°C</strong>,
    },
  };

  const marks1 = {
    // 0: '0°C',
    15: "$ 50",
    65: "$ 300",
    100: {
      style: {
        color: "#f50",
      },
      // label: <strong>100°C</strong>,
    },
  };

  return (
    <>
      <div className="row  px-2 pt-4">
        <div className="col-12  ">
          <p className="mb-0 dashboard-com-top-text">Manage Roles</p>
        </div>
        <div className="col-12  ">
          <div className="row d-flex align-items-end">
            <div className="col-lg-6 col-12 mt-lg-0 mt-2">
              <p className="mb-0 doctor-header-top-text">
                <Link className="doc-link " to="/">
                  DASHBOARD
                </Link>
                <img
                  className="mx-lg-3 ml-2 pr-1 pb-1"
                  src={RightArrow}
                  alt=""
                />
                <span style={{ color: "#4FA6D1" }}>MANAGE ROLES</span>
              </p>
            </div>

            <div className="col-lg-6 col-12 mt-lg-0 mt-3 d-flex justify-content-end ">
              <Link to="/role/add">
                <button className="btn-add-new-doc w-100 px-5">
                  Add Roles
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12  ">
          <div className="row mb-5 pb-5">
            <div className="col-12  pb-2 d-flex justify-content-start">
              <Searchbar
                onChange={handleSearchChange}
                value={searchQuery}
                placeholder="Search"
              />
            </div>

            <div className="col-12 px-2">
              <AllRolesDataTables rows={rows} searchQuery={searchQuery} />
            </div>
          </div>

          <AddRoleModal
            modal1Open={modal1Open}
            setModal1Open={(data) => {
              setModal1Open(data);
            }}
            typeName="Add"
          />
        </div>
      </div>
    </>
  );
};

export default AllRoles;
