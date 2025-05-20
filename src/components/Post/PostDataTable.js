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
import { Button, Modal, Rate, Select, Slider, Tooltip } from "antd";
import sohaibavatar from "../../assets/images/dashboard/sohaibavatar.png";
import "../../assets/css/common/datatable.scss";
import { Box, Typography, useMediaQuery } from "@mui/material";
import CustomPagination from "../common/CustomPagination.js";
import prescriptionSVG from "../../assets/images/common/prescription.svg";
import Edit from "../common/Edit.js";
import Delete from "../common/Delete.js";
import Cross from "../common/Cross.js";
import Tick from "../common/Tick.js";

// img svg
import DeleteIcon from "../../assets/images/pharmacy/DeleteIcon.svg";
import EditIcon from "../../assets/images/pharmacy/EditIcon.svg";
import CameraIcon from "../../assets/images/doctor/CameraIcon.svg";

import { Link } from "react-router-dom";
import useDeleteData from "../../customHook/useDelete.js";
import { useMemo } from "react";
import { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import ButtonLoader from "../../atoms/buttonLoader/index.js";
import ImagePreview from "../../atoms/ImagePreview/index.js";
import DeletConfirmation from "../../atoms/deletConfirmation/index.js";
import { CustomToast } from "../../atoms/toastMessage/index.js";
import useFetch from "../../customHook/useFetch.js";
import ListSkeleton from "../../molecules/ListSkeleton/ListSkeleton.js";
import { allPostData } from "../../Data/Data.js";
import moment from "moment/moment.js";

const DataTable = ({ searchQuery, title = 'Edit a Pharmacy',  setRows, loading }) => {

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
console.log("page", page)
    const { isLoading, error, deleteData } = useDeleteData();

    const getHospital = useFetch(
        `${process.env.REACT_APP_GET_HOSPITAL_DATA}?per_page=${rowsPerPage}&page=${page}`
      )

      const rows = getHospital.data
      console.log("roesss", rows?.data)

    const [modal1Open, setModal1Open] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [errorData, setErrorData] = useState(0);
    const [deleteState, setDeleteState] = useState(0);

    const [image, setImage] = useState(null);
    const [postData,setPostData]=useState();
    useEffect(()=>{
        const filteredPost = searchQuery != null && searchQuery != "" 
        ? allPostData.filter((element) => {
            const searchString = searchQuery.toLowerCase(); // Convert the filter to lowercase for case-insensitive search
            return Object.values(element).some((value) => {
              if (value && typeof value === 'string') {
                return value.toLowerCase().includes(searchString);
              }
              return false;
            });
          })
        : allPostData;
        setPostData(filteredPost)
    },[searchQuery])
    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleDelete = () => {

        deleteData(`${process.env.REACT_APP_DELETE_HOSPITAL_DATA}/${deleteState}`, () => {
            setDeleteModal(false)
            getHospital.fetchPaginatedData(`${process.env.REACT_APP_GET_HOSPITAL_DATA}?per_page=${rowsPerPage}&page=${page}`)
            // const filter = rows?.data?.data?.filter(val => val.id !== deleteState)
            CustomToast({
                type: "success",
                message: "Hospital Delete Successfuly!",
              });
            
            // setRows(filter)
        });
    };

    const totalRows = rows?.data?.total;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startIndex = page * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
    const visibleRows = rows?.data?.data

    const isLargeScreen = useMediaQuery('(min-width: 1024px)');
    const isMediumScreen = useMediaQuery('(min-width: 484px)');

    const handleImageClick = (imageUrl) => {
        setImagePreviewUrl(imageUrl);
        setIsPreviewOpen(true);
    };
    // Function to close the preview
    const closeImagePreview = () => {
        setIsPreviewOpen(false);
    };

    return (
        <>

            <div className="row  ml-0 mx-2 " style={{ overflowX: "hidden" }}>

                <ImagePreview imagePreviewUrl={imagePreviewUrl} closeImagePreview={closeImagePreview} isPreviewOpen={isPreviewOpen} />
                <DeletConfirmation
                    deleteModal={deleteModal}
                    setDeleteModal={setDeleteModal}
                    handleDelete={handleDelete}
                    isLoading={isLoading}
                />
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
                                <TableCell align="left">Author</TableCell>
                                <TableCell align="center">Univeristy</TableCell>
                                <TableCell align="center">Comments</TableCell>
                                <TableCell align="center">Likes</TableCell>
                                <TableCell align="center">Content</TableCell>
                                <TableCell align="center">Timestamp</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody className="w-100"
                            sx={{
                                "& td": {
                                    color: "#767676",
                                    whiteSpace: "nowrap",
                                    wordWrap: "break-word",
                                },
                            }}
                        >
                            {!getHospital?.isLoading ? postData?.map(({ post_id, profile_picture, author, university, comments, likes, content, timestamp }, index) => (
                                <TableRow
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell align="left">
                                        <CardHeader
                                            sx={{ padding: "0px" }}
                                            avatar={
                                                <Box
                                                    sx={{
                                                        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
                                                    }}
                                                >
                                                    <Avatar alt="Hospital Pic" src={`${profile_picture}`} onClick={() => handleImageClick(profile_picture)} />
                                                </Box>
                                            }
                                            title={author}
                                        />
                                    </TableCell>
                                    <TableCell align="center">{university}</TableCell>
                                    <TableCell align="center">{comments}</TableCell>
                                    <TableCell align="center">{likes}</TableCell>
                                    <TableCell align="center"> 
                                    <Tooltip placement="topRight" title={content} >
                                    {content?.length > 22 ? content?.slice(0, 22) + '...' : content}
                                    </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">{moment(timestamp).format('DD-MM-YYYY HH:MM')}</TableCell>
                                    <TableCell  align="center">
                                        <img className='cursor-pointer' onClick={() => {
                                            setDeleteModal(true)
                                            setDeleteState(post_id)
                                        }} src={DeleteIcon} />
                                    </TableCell>
                                </TableRow>
                            )) :
                            <TableRow>
                            <TableCell colSpan={9}>
                              <ListSkeleton totalRow={4} totalCol={9} image={true} />
                            </TableCell>
                          </TableRow>
                            }

                        </TableBody>
                    </Table>
                </TableContainer>

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

export default DataTable;