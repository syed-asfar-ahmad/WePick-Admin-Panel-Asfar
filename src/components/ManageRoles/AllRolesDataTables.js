import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { Button, Modal, Rate, Select, Slider } from "antd";
import sohaibavatar from "../../assets/images/dashboard/sohaibavatar.png";
import "../../assets/css/common/datatable.scss";
import { Box, Typography, useMediaQuery } from "@mui/material";
import CustomPagination from "../common/CustomPagination";
import prescriptionSVG from "../../assets/images/common/prescription.svg";
import Edit from "../common/Edit.js";
import Delete from "../common/Delete.js";
import Cross from "../common/Cross";
import Tick from "../common/Tick.js";

// img svg
import DeleteIcon from "../../assets/images/pharmacy/DeleteIcon.svg";
import EditIcon from "../../assets/images/pharmacy/EditIcon.svg";
import CameraIcon from "../../assets/images/doctor/CameraIcon.svg";
import DeleteBigIcon from "../../assets/images/doctor/DeleteBigIcon.svg";

// images png
import pic1 from "../../assets/images/doctor/doc1.png";
import pic2 from "../../assets/images/doctor/doc2.png";
import pic3 from "../../assets/images/doctor/doc3.png";
import pic4 from "../../assets/images/doctor/doc4.png";
import pic5 from "../../assets/images/doctor/doc5.png";
import pic6 from "../../assets/images/doctor/doc6.png";
import pic7 from "../../assets/images/doctor/doc7.png";
import pic8 from "../../assets/images/doctor/doc8.png";
import { Link } from "react-router-dom";
import AddRoleModal from "../../molecules/AddRoleModal/AddRoleModal";
import useFetch from "../../customHook/useFetch";
import ButtonLoader from "../../atoms/buttonLoader";
import DeletConfirmation from "../../atoms/deletConfirmation";
import useDeleteData from "../../customHook/useDelete";
import { CustomToast } from "../../atoms/toastMessage";
import ListSkeleton from "../../molecules/ListSkeleton/ListSkeleton";

// const rows = [
//     {
//         id: 1,
//         pic: pic1,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "Bidadari Park Drive Singapore",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 2,
//         pic: pic2,
//         name: "Sufians",
//         email: 'sufian.zulfiqars@txlabz.com',
//         address: "137 Market St Singapore 048943",
//         mobile: "+91-955-555-0000",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "55000",
//     },
//     {
//         id: 3,
//         pic: pic3,
//         name: "Jira",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "5 Koh Sek Lim Rd Singapore 486050",
//         mobile: "+91-955-555-1111",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "56000",
//     },
//     {
//         id: 4,
//         pic: pic4,
//         name: "Sufianz",
//         email: 'sufian.zulfiqarz@txlabz.com',
//         address: "52 Bedok Reservoir Cres Singapore 479226",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 5,
//         pic: pic5,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "Bukit Batok West Ave 9 Singapore",
//         mobile: "+91-955-555-3331",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "51000",
//     },
//     {
//         id: 6,
//         pic: pic6,
//         name: "Haider",
//         email: 'name@txlabz.com',
//         address: "15 Changi Business Park Cres Singapore",
//         mobile: "+91-955-555-1234",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "56100",
//     },
//     {
//         id: 7,
//         pic: pic7,
//         name: "Name",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "1 Wallich St Singapore",
//         mobile: "+91-955-555-5678",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 8,
//         pic: pic8,
//         name: "Ali",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "St George's Ln Singapore",
//         mobile: "+91-955-555-9751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 9,
//         pic: pic1,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 10,
//         pic: pic2,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 11,
//         pic: pic3,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 12,
//         pic: pic4,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 1,
//         pic: pic1,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "Bidadari Park Drive Singapore",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 2,
//         pic: pic2,
//         name: "Sufians",
//         email: 'sufian.zulfiqars@txlabz.com',
//         address: "137 Market St Singapore 048943",
//         mobile: "+91-955-555-0000",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "55000",
//     },
//     {
//         id: 3,
//         pic: pic3,
//         name: "Jira",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "5 Koh Sek Lim Rd Singapore 486050",
//         mobile: "+91-955-555-1111",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "56000",
//     },
//     {
//         id: 4,
//         pic: pic4,
//         name: "Sufianz",
//         email: 'sufian.zulfiqarz@txlabz.com',
//         address: "52 Bedok Reservoir Cres Singapore 479226",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 5,
//         pic: pic5,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "Bukit Batok West Ave 9 Singapore",
//         mobile: "+91-955-555-3331",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "51000",
//     },
//     {
//         id: 6,
//         pic: pic6,
//         name: "Haider",
//         email: 'name@txlabz.com',
//         address: "15 Changi Business Park Cres Singapore",
//         mobile: "+91-955-555-1234",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "56100",
//     },
//     {
//         id: 7,
//         pic: pic7,
//         name: "Name",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "1 Wallich St Singapore",
//         mobile: "+91-955-555-5678",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 8,
//         pic: pic8,
//         name: "Ali",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "St George's Ln Singapore",
//         mobile: "+91-955-555-9751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 9,
//         pic: pic1,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 10,
//         pic: pic2,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 11,
//         pic: pic3,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 12,
//         pic: pic4,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 1,
//         pic: pic1,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "Bidadari Park Drive Singapore",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 2,
//         pic: pic2,
//         name: "Sufians",
//         email: 'sufian.zulfiqars@txlabz.com',
//         address: "137 Market St Singapore 048943",
//         mobile: "+91-955-555-0000",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "55000",
//     },
//     {
//         id: 3,
//         pic: pic3,
//         name: "Jira",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "5 Koh Sek Lim Rd Singapore 486050",
//         mobile: "+91-955-555-1111",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "56000",
//     },
//     {
//         id: 4,
//         pic: pic4,
//         name: "Sufianz",
//         email: 'sufian.zulfiqarz@txlabz.com',
//         address: "52 Bedok Reservoir Cres Singapore 479226",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 5,
//         pic: pic5,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "Bukit Batok West Ave 9 Singapore",
//         mobile: "+91-955-555-3331",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "51000",
//     },
//     {
//         id: 6,
//         pic: pic6,
//         name: "Haider",
//         email: 'name@txlabz.com',
//         address: "15 Changi Business Park Cres Singapore",
//         mobile: "+91-955-555-1234",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "56100",
//     },
//     {
//         id: 7,
//         pic: pic7,
//         name: "Name",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "1 Wallich St Singapore",
//         mobile: "+91-955-555-5678",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 8,
//         pic: pic8,
//         name: "Ali",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "St George's Ln Singapore",
//         mobile: "+91-955-555-9751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 9,
//         pic: pic1,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 10,
//         pic: pic2,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 11,
//         pic: pic3,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 12,
//         pic: pic4,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 1,
//         pic: pic1,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "Bidadari Park Drive Singapore",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 2,
//         pic: pic2,
//         name: "Sufians",
//         email: 'sufian.zulfiqars@txlabz.com',
//         address: "137 Market St Singapore 048943",
//         mobile: "+91-955-555-0000",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "55000",
//     },
//     {
//         id: 3,
//         pic: pic3,
//         name: "Jira",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "5 Koh Sek Lim Rd Singapore 486050",
//         mobile: "+91-955-555-1111",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "56000",
//     },
//     {
//         id: 4,
//         pic: pic4,
//         name: "Sufianz",
//         email: 'sufian.zulfiqarz@txlabz.com',
//         address: "52 Bedok Reservoir Cres Singapore 479226",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 5,
//         pic: pic5,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "Bukit Batok West Ave 9 Singapore",
//         mobile: "+91-955-555-3331",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "51000",
//     },
//     {
//         id: 6,
//         pic: pic6,
//         name: "Haider",
//         email: 'name@txlabz.com',
//         address: "15 Changi Business Park Cres Singapore",
//         mobile: "+91-955-555-1234",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "56100",
//     },
//     {
//         id: 7,
//         pic: pic7,
//         name: "Name",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "1 Wallich St Singapore",
//         mobile: "+91-955-555-5678",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 8,
//         pic: pic8,
//         name: "Ali",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "St George's Ln Singapore",
//         mobile: "+91-955-555-9751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 9,
//         pic: pic1,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 10,
//         pic: pic2,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 11,
//         pic: pic3,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
//     {
//         id: 12,
//         pic: pic4,
//         name: "Sufian",
//         email: 'sufian.zulfiqar@txlabz.com',
//         address: "510 Kampong Bahru Rd Singapore 099446",
//         mobile: "+91-955-555-4751",
//         country: "Kuwait",
//         state: "Kuwait city",
//         zipcode: "54000",
//     },
// ]




const AllRolesDataTables = ({ searchQuery }) => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const [modal1Open, setModal1Open] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const [deleteState, setDeleteState] = useState(0);

    const isLargeScreen = useMediaQuery('(min-width: 1024px)');
    const isMediumScreen = useMediaQuery('(min-width: 484px)');

    const [allRoleData, setAllRoleData] = useState('');

    const [errorData, setErrorData] = useState(0);

    const [image, setImage] = useState(null);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const getroles = useFetch(
        `${process.env.REACT_APP_LIST_ROLE}?per_page=${rowsPerPage}&page=${page}`
    );

    const rows = getroles.data
    console.log("roesss", rows?.data)

    const deleteroles = useDeleteData();


    // setAllRoleData(getroles?.data?.data)
console.log("getroles", getroles)
    const handleDelete = () => {

        deleteroles?.deleteData(`${process.env.REACT_APP_DELETE_ROLE}/${deleteState}`, () => {
            setDeleteModal(false)
            getroles.fetchPaginatedData(`${process.env.REACT_APP_DELETE_ROLE}?per_page=${rowsPerPage}&page=${page}`)
            // const filter = rows?.data?.data?.filter(val => val.id !== deleteState)
            CustomToast({
                type: "success",
                message: "Role Delete Successfuly!",
            });

            // setRows(filter)
        });
    };


    const handleDoctorImageClick = () => {
        // Create a file input element and trigger a click event
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        // input.accept = 'image/png,image/jpeg';  // its just show png and jpeg file rather then other
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) {
                setErrorData(0);
                return;
            }
            const fileType = file.type;
            if (fileType !== "image/png" && fileType !== "image/jpeg") {
                setErrorData(1);
                return;
            } else {
                setErrorData(0);
            }
            // Set the selected image as the state of the component
            setImage(URL.createObjectURL(file));
        };
        input.click();
    };


    console.log("getroles", getroles?.data?.data)

    // const rows = getroles?.data?.data || [{}, {}]

    // const rows = getHospital.data

    console.log("rowfirst", rows)

    const totalRows = rows?.data?.total;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startIndex = page * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
    const visibleRows = rows?.data?.data

    console.log("visibleRowsdd", visibleRows)

    //     const visibleRows = rows.filter((item) => {
    //     var lcInfo = searchQuery.toLocaleLowerCase();
    //     return lcInfo === ""
    //         ? item
    //         : item.name.toLocaleLowerCase().includes(lcInfo) ||
    //         item.address.toLocaleLowerCase().includes(lcInfo) ||
    //         item.mobile.toLocaleLowerCase().includes(lcInfo) ||
    //         item.country.toLocaleLowerCase().includes(lcInfo) ||
    //         item.zipcode.toLocaleLowerCase().includes(lcInfo) ||
    //         item.state.toLocaleLowerCase().includes(lcInfo)
    // })?.slice(startIndex, endIndex);

    return (
        <>

            <DeletConfirmation
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                handleDelete={handleDelete}
                isLoading={deleteroles?.isLoading}
            />

            <div className="row  ml-0 mx-2 " style={{ overflowX: "hidden" }}>



                <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: "#FFFFFF" }}
                    className="custom-scroll"
                >
                    <Table aria-label="simple table">
                        <TableHead
                            sx={{
                                "& th": {
                                    color: "#193F52",
                                    whiteSpace: "nowrap",
                                    wordWrap: "break-word",
                                },
                            }}
                        >
                            <TableRow>
                                <TableCell className="number" align="left">
                                    #
                                </TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Role</TableCell>
                                <TableCell align="left">Email</TableCell>
                                {/* <TableCell align="left">Address</TableCell> */}
                                {/* <TableCell align="left">Mobile No.</TableCell> */}
                                {/* <TableCell align="left">Country</TableCell> */}
                                {/* <TableCell align="left">State</TableCell> */}
                                {/* <TableCell align="left">State</TableCell> */}
                                <TableCell align="left">Edit</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody
                            sx={{
                                "& td": {
                                    color: "#767676",
                                    whiteSpace: "nowrap",
                                    wordWrap: "break-word",
                                },
                            }}
                        >

                            {
                                console.log("visibleRowseee", visibleRows)
                            }

                            {!getroles?.isLoading ? visibleRows.map(({ access_id, name, email, profile_pic, contact, country, state, role }, index) => (

                                <TableRow
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell align="left" className="number">
                                    {((page -1) * rowsPerPage + index) + 1}
                                    </TableCell>
                                    <TableCell align="left">
                                        <CardHeader
                                            sx={{ padding: "0px" }}
                                            avatar={
                                                <Box
                                                    sx={{
                                                        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
                                                    }}
                                                >
                                                    <Avatar alt={email.charAt(0)?.toUpperCase()} src={`${process.env.REACT_APP_IMAGE_URL + profile_pic}`} />
                                                </Box>
                                            }
                                            title={name?.charAt(0)?.toUpperCase() + name?.slice(1)}
                                        />
                                    </TableCell>
                                    {/* <TableCell align="left">{address}</TableCell> */}
                                    <TableCell align="left">{role === 'doctor'? 'Doctor Admin': 
                                    role ==='hospitaladmin' ? 'Hospital Admin':
                                    role ==='pharmacist' ? 'Pharmacy Admin':
                                    role ==='technologist' ? 'Laboratory Admin':
                                    role ==='radiologic' ? 'X-ray Admin':
                                    role ==='storeadmin' ? 'Medical Equipment Admin':
                                    'null'
                                    }</TableCell>
                                    <TableCell align="left">{email?.charAt(0).toUpperCase() + email?.slice(1)}</TableCell>
                                    {/* <TableCell align="left">{contact}</TableCell> */}
                                    {/* <TableCell align="left">{country}</TableCell> */}
                                    {/* <TableCell align="left">{state}</TableCell> */}
                                    {/* <TableCell align="left">{zipcode}</TableCell> */}


                                    <TableCell >
                                        <Link to={`/role/edit/${access_id}`}
                                        >   <img className='' src={EditIcon} />
                                        </Link>
                                        <img className='' onClick={() => {
                                            setDeleteModal(true)
                                            setDeleteState(access_id)
                                        }} src={DeleteIcon} />
                                    </TableCell>
                                </TableRow>

                            )) :
                            <TableRow>
                            <TableCell colSpan={5}>
                              <ListSkeleton totalRow={4} totalCol={5} image={true} />
                            </TableCell>
                          </TableRow>}

                            {/* {Object.entries(visibleRows).map(([key, value]) => (
                                <div key={key}>
                                    Role ID: {key}
                                    <br />
                                    Role Data: {JSON.stringify(value)}
                                    <hr />
                                </div>
                            ))} */}
                        </TableBody>
                    </Table>
                </TableContainer>


                <AddRoleModal modal1Open={modal1Open} setModal1Open={(data) => { setModal1Open(data) }} typeName='Edit' />

                {/* <Modal
                    className="doctor-filter-modal"
                    centered
                    open={deleteModal}
                    // onOk={() => setModal2Open(false)}
                    onCancel={() => setDeleteModal(false)}
                    width={514}
                    footer={null}
                    closable={false}

                >

                    <div className="row pb-1">
                        <div className="col-12 d-flex flex-column align-items-center justify-content-center pharmacy-delete">
                            <div className=' mt-4 d-flex justify-content-center align-items-center' style={{ width: "100px", height: "100px", background: "rgba(236, 130, 110, 0.3)", borderRadius: "50px" }}>
                                <img src={DeleteBigIcon} alt="" />
                            </div>
                            <p className='mb-0 pt-4 mt-2 delete-role-manage'>Delete a Role</p>
                            <p className='mb-0  pb-4 mt-lg-3 mt-2'>Are you sure you want to delete?</p>
                            <button className='mt-lg-3 mt-1 mb-lg-5 mb-2'>Delete</button>
                        </div>
                    </div>
                </Modal> */}

            </div>

            <div className="pagination-container px-md-3 ml-md-1 mt-md-2 ">
                <div className="pagination-detail">
                    Showing {(page -1) * rowsPerPage + 1} -{" "}
                    {rows?.data?.to} of {rows?.data?.total}
                </div>
                <CustomPagination
                    page={page}
                    totalPages={totalPages}
                    onChangePage={handleChangePage}
                />
            </div>
        </>
    );
};

export default AllRolesDataTables;






