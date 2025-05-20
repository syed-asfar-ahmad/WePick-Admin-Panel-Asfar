import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CardHeader from "@mui/material/CardHeader";
import { Avatar, Button, Modal, Rate, Select, Slider, Tooltip } from "antd";
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
import { GrFormView } from "react-icons/gr";

import { Link } from "react-router-dom";
import useDeleteData from "../../customHook/useDelete";
import { useMemo } from "react";
import { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import ButtonLoader from "../../atoms/buttonLoader";
import ImagePreview from "../../atoms/ImagePreview";
import DeletConfirmation from "../../atoms/deletConfirmation";
import { CustomToast } from "../../atoms/toastMessage";
import useFetch from "../../customHook/useFetch";
import ListSkeleton from "../../molecules/ListSkeleton/ListSkeleton";
import { allPostData, customCommunityData, officialCommunityData, universityData } from "../../Data/Data.js";
import moment from "moment/moment.js";

const CustomComunityDataTable = ({ searchQuery, title = 'Edit a Pharmacy',  setRows, loading }) => {

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
    const [customComunity,setCustomComunity]=useState();
    useEffect(()=>{
        const filteredComunity = searchQuery != null && searchQuery != "" 
        ? customCommunityData.filter((element) => {
            const searchString = searchQuery.toLowerCase(); // Convert the filter to lowercase for case-insensitive search
            return Object.values(element).some((value) => {
              if (value && typeof value === 'string') {
                return value.toLowerCase().includes(searchString);
              }
              return false;
            });
          })
        : customCommunityData;
        setCustomComunity(filteredComunity)
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
    function getInitials(name) {
        const names = name.split(' ');
        const initials = names.map(n => n.charAt(0).toUpperCase()).join('');
        return initials;
    }
    return (
      <>
        <div className="row  ml-0 mx-2 " style={{ overflowX: "hidden" }}>
          <ImagePreview
            imagePreviewUrl={imagePreviewUrl}
            closeImagePreview={closeImagePreview}
            isPreviewOpen={isPreviewOpen}
          />
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
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Banner</TableCell>
                  <TableCell align="center">Creator</TableCell>

                  <TableCell align="center">Ranking</TableCell>
                  <TableCell align="center">Bio</TableCell>
                  <TableCell align="center">Followers</TableCell>
                  <TableCell align="center">Likes</TableCell>

                  {/* <TableCell align="center">Rank</TableCell> */}
                  <TableCell align="center">Hosting Members</TableCell>
                  <TableCell align="center">Membership Type</TableCell>
                  {/* <TableCell align="center">Campus Size</TableCell> */}
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody
                className="w-100"
                sx={{
                  "& td": {
                    color: "#767676",
                    whiteSpace: "nowrap",
                    wordWrap: "break-word",
                  },
                }}
              >
                {!getHospital?.isLoading ? (
                  customComunity?.map(
                    (
                      {
                        Creator,
                        banner,
                        name,
                        bio,
                        ranking,
                        followers,
                        likes,
                        hosting_members,
                        Membership,
                        image,
                      },
                      index
                    ) => (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="left">
                          <CardHeader
                            sx={{ padding: "0px" }}
                            avatar={
                              <Box
                                sx={{
                                  filter:
                                    "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
                                }}
                              >
                                <Avatar
                                  alt="Hospital Pic"
                                  src={`${image}`}
                                  onClick={() => handleImageClick(image)}
                                />
                              </Box>
                            }
                            title={name}
                          />
                        </TableCell>
                        <TableCell align="left">
                          <CardHeader
                            sx={{ padding: "0px" }}
                            avatar={
                              <Box
                                sx={{
                                  filter:
                                    "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
                                }}
                              >
                                <Avatar
                                  alt="Hospital Pic"
                                  src={`${banner}`}
                                  onClick={() => handleImageClick(banner)}
                                />
                              </Box>
                            }
                          />
                        </TableCell>
                        <TableCell align="center">{Creator}</TableCell>

                        <TableCell align="center">{ranking}</TableCell>
                        <TableCell align="center">
                          <Tooltip placement="topRight" title={bio}>
                            {bio?.length > 22 ? bio?.slice(0, 22) + "..." : bio}
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">{followers}</TableCell>
                        <TableCell align="center">{followers*2}</TableCell>
                        {/* <TableCell align="center">{rank}</TableCell> */}
                        <TableCell align="center">
                          <Avatar.Group
                            maxCount={2}
                            maxPopoverTrigger="click"
                            size="large"
                            maxStyle={{
                              color: "#f56a00",
                              backgroundColor: "#fde3cf",
                              cursor: "pointer",
                            }}
                          >
                            {hosting_members?.map((user) => (
                              <Tooltip title={user} placement="top">
                                <Avatar style={{ backgroundColor: "#87d068" }}>
                                  {getInitials(user)}
                                </Avatar>
                              </Tooltip>
                            ))}
                          </Avatar.Group>
                        </TableCell>
                        <TableCell align="center">{Membership}</TableCell>
                        {/* <TableCell align="center">{campus_size}</TableCell> */}
                        <TableCell align="center">
                          <Link to={`/comunity/view/${index}`}>
                            <GrFormView color="gray" size={35} />
                          </Link>
                          <img
                            className="cursor-pointer"
                            onClick={() => {
                              setDeleteModal(true);
                              setDeleteState(index);
                            }}
                            src={DeleteIcon}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <ListSkeleton totalRow={4} totalCol={9} image={true} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="pagination-container px-md-3 ml-md-1 mt-md-2 ">
          <div className="pagination-detail">
            Showing {(page - 1) * rowsPerPage + 1} - {rows?.data?.to} of{" "}
            {rows?.data?.total}
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

export default CustomComunityDataTable;