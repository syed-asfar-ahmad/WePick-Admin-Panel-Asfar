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

    console.log("getroles", getroles)

    const handleDelete = () => {
        deleteroles?.deleteData(`${process.env.REACT_APP_DELETE_ROLE}/${deleteState}`, () => {
            setDeleteModal(false)
            getroles.fetchPaginatedData(`${process.env.REACT_APP_DELETE_ROLE}?per_page=${rowsPerPage}&page=${page}`)
            CustomToast({
                type: "success",
                message: "Role Delete Successfuly!",
            });
        });
    };

    const handleDoctorImageClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
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
            setImage(URL.createObjectURL(file));
        };
        input.click();
    };

    console.log("getroles", getroles?.data?.data)

    console.log("rowfirst", rows)

    const totalRows = rows?.data?.total;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startIndex = page * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
    const visibleRows = rows?.data?.data

    console.log("visibleRowsdd", visibleRows)

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
                            {console.log("visibleRowseee", visibleRows)}

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
                                    <TableCell align="left">{role === 'doctor'? 'Doctor Admin': 
                                    role ==='hospitaladmin' ? 'Hospital Admin':
                                    role ==='pharmacist' ? 'Pharmacy Admin':
                                    role ==='technologist' ? 'Laboratory Admin':
                                    role ==='radiologic' ? 'X-ray Admin':
                                    role ==='storeadmin' ? 'Medical Equipment Admin':
                                    'null'
                                    }</TableCell>
                                    <TableCell align="left">{email?.charAt(0).toUpperCase() + email?.slice(1)}</TableCell>
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
                        </TableBody>
                    </Table>
                </TableContainer>

                <AddRoleModal modal1Open={modal1Open} setModal1Open={(data) => { setModal1Open(data) }} typeName='Edit' />
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






