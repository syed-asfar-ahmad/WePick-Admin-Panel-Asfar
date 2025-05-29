import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
//import ButtonLoader from "../../atoms/buttonLoader";
import Paper from "@mui/material/Paper";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Rating from "@mui/material/Rating";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import CircularProgress from "@mui/material/CircularProgress";
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
import {
  allPostData,
  customCommunityData,
  officialCommunityData,
  storiesData,
  universityData,
} from "../../Data/Data.js";
import moment from "moment/moment.js";

const AllStoriesDataTable = ({
  searchQuery,
  title = "Edit a Pharmacy",
  setRows,
  loading,
}) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  console.log("page", page);
  const { isLoading, error, deleteData } = useDeleteData();

  const getHospital = useFetch(
    `${process.env.REACT_APP_GET_HOSPITAL_DATA}?per_page=${rowsPerPage}&page=${page}`
  );

  const rows = getHospital.data;
  console.log("roesss", rows?.data);

  const [modal1Open, setModal1Open] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [errorData, setErrorData] = useState(0);
  const [deleteState, setDeleteState] = useState(0);

  const [image, setImage] = useState(null);
  const [stories, setStories] = useState();
  useEffect(() => {
    const filteredStories =
      searchQuery != null && searchQuery != ""
        ? storiesData.filter((element) => {
            const searchString = searchQuery.toLowerCase(); // Convert the filter to lowercase for case-insensitive search
            return Object.values(element).some((value) => {
              if (value && typeof value === "string") {
                return value.toLowerCase().includes(searchString);
              }
              return false;
            });
          })
        : storiesData;
    setStories(filteredStories);
  }, [searchQuery]);
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = () => {
    deleteData(
      `${process.env.REACT_APP_DELETE_HOSPITAL_DATA}/${deleteState}`,
      () => {
        setDeleteModal(false);
        getHospital.fetchPaginatedData(
          `${process.env.REACT_APP_GET_HOSPITAL_DATA}?per_page=${rowsPerPage}&page=${page}`
        );
        // const filter = rows?.data?.data?.filter(val => val.id !== deleteState)
        CustomToast({
          type: "success",
          message: "Hospital Delete Successfuly!",
        });

        // setRows(filter)
      }
    );
  };

  const totalRows = rows?.data?.total;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const visibleRows = rows?.data?.data;

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const isMediumScreen = useMediaQuery("(min-width: 484px)");

  const handleImageClick = (imageUrl) => {
    setImagePreviewUrl(imageUrl);
    setIsPreviewOpen(true);
  };
  // Function to close the preview
  const closeImagePreview = () => {
    setIsPreviewOpen(false);
  };
  function abbreviateWords(input) {
    // Split the input string into an array of words
    const words = input.split(" ");

    // Extract the first letter of each word and convert to uppercase
    const abbreviations = words.map((word) => word.charAt(0).toUpperCase());

    // Join the extracted letters together to form the abbreviation
    const abbreviation = abbreviations.join("");

    return abbreviation;
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
                <TableCell align="left">Author</TableCell>
                <TableCell align="left">Story</TableCell>
                {/* <TableCell align="center">Founded Year</TableCell> */}
                <TableCell align="center">Views</TableCell>

                <TableCell align="center">Published Date</TableCell>

                {/* <TableCell align="center">Rank</TableCell> */}
                <TableCell align="center">University</TableCell>
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
                stories?.map(
                  (
                    {
                      id,
                      story,
                      author,
                      title,
                      content,
                      publishedDate,
                      views,
                      university,
                      profileImage,
                    },
                    index
                  ) => (
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
                                src={`${profileImage}`}
                                onClick={() => handleImageClick(profileImage)}
                              />
                            </Box>
                          }
                          title={author}
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
                                src={`${story}`}
                                onClick={() => handleImageClick(story)}
                              />
                            </Box>
                          }
                        />
                      </TableCell>
                      {/* <TableCell align="center">{founded_year}</TableCell> */}
                      <TableCell align="center">{views}</TableCell>
                      <TableCell align="center">{publishedDate}</TableCell>
                      {/* <TableCell align="center">{rank}</TableCell> */}
                      <TableCell align="center">{university}</TableCell>
                      <TableCell align="center">
                        {/* <Link to={`/comunity/view/${index}`}>
                                        <GrFormView color="gray" size={35} />
                                        </Link> */}
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setDeleteModal(true);
                            setDeleteState(id);
                          }}
                        >
                          {DeleteIcon}
                        </div>
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

export default AllStoriesDataTable;
