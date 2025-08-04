import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { CustomToast } from "../../atoms/toastMessage";
// import { GrFormView } from "react-icons/gr";
import CardHeader from "@mui/material/CardHeader";
import { Box, debounce } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import ImagePreview from "../ImagePreview";
import { Avatar, Tooltip } from "antd";
import { Switch } from "antd";
import {
  EditIcon,
  DeleteIcon,
  HostEyeSvg,
  moderationUsers,
} from "../../assets/icons";
import DataGridSkeleton from "./DataGridSkeleton.js";
import ConfirmationModal from "../ConfirmationModal/index.jsx";
import { tickSvg, fileTag } from "../../assets/icons";
import EventHostModal from "../eventHostModal/index.js";
import UploadImageModal from "../UploadReceiptModal/index.js";
import RecieptView from "../RecieptView/index.js";
import AccountView from "../Acoount/index.js";

const DG = ({ index, loader, data, getData, setFilterState }) => {
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [hostModal, setHostModal] = useState(false);
  const [hostedBy, setHostedBy] = useState("");

  const [deleteState, setDeleteState] = useState(0);
  // const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  // const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eventClicked, setEventClicked] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReciept, setShowReciept] = useState(null);
  const [showAccount, setShowAccount] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("image.png");
  // console.log("uploadedFileName =>>>", uploadedFileName);
  // const truncateFileName = (name, maxLength = 10) => {
  //   if (name?.length > maxLength) {
  //     return name?.substring(0, maxLength) + "...png";
  //   }
  //   return name;
  // };
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState({
    image: null,
    video: null,
    description: "null",
    userProfile: null,
  });

  const calculateStatus = (createdAt) => {
    const now = moment();
    const createdTime = moment(createdAt);
    const hoursDiff = now.diff(createdTime, "hours");
    return hoursDiff < 24;
  };

  const handleImageClick = (
    image,
    video,
    description,
    userProfile,
    userName,
    storyTime
  ) => {
    setPreviewData({
      image,
      video,
      description,
      userProfile,
      userName,
      storyTime,
    });
    setIsPreviewOpen(true);
  };

  const closeImagePreview = () => {
    setIsPreviewOpen(false);
    setPreviewData({ image: null, video: null, description: null });
  };

  const handleFileUpload = (fileName) => {
    // setUploadedFileName(() => {
    //   truncateFileName(fileName[0].name);
    // });
    setUploadedFileName(fileName);
  };
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  const getInitials = (name) => {
    if (typeof name !== "string" || name?.trim()?.length === 0) {
      return "";
    }

    const names = name
      .trim()
      .split(" ")
      .filter((n) => n.length > 0);

    const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");

    return initials;
  };

  const userColumns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      sortable: false,
      valueGetter: (params) => (params.row.isAnonymous ? params.row.userName : params.row.name),
    },
    {
      field: "email",
      headerName: "Email",
      sortable: true,
      headerAlign: "center",
      align: "center",
      flex: 2,
    },
    {
      field: "university",
      headerName: "University",
      sortable: true,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
    },
    {
      field: "likes",
      headerName: "Likes",
      sortable: true,
      flex: 0.7,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            <Link
              to={`/users/likes/${params?.id}`}
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "black",
              }}
            >
              {params.value}
            </Link>
          </>
        );
      },
    },
    {
      field: "post",
      headerName: "Post",
      sortable: true,
      flex: 0.7,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            <Link
              to={`/user/posts/${params?.row?.id}`}
              style={{
                color: "#000",
              }}
            >
              {params?.value}
            </Link>
          </>
        );
      },
    },
    {
      field: "friends",
      headerName: "Friends",
      sortable: true,
      flex: 0.7,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            {params?.value > 0 ? (
              <Link
                to={`/userfriends/${params?.row?.id}`}
                style={{
                  color: "#000",
                }}
              >
                {params?.value}
              </Link>
            ) : (
              <span>{params?.value}</span>
            )}
          </>
        );
      },
    },
    {
      field: "course",
      headerName: "Course",
      sortable: false,
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <span>
            {params.value ? params.value : "-"}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      renderCell: (params) => {
        return (
          <span
            style={{
              padding: "5px 10px",
              borderRadius: "15px",
              backgroundColor: params.value ? "#3BAF2A1A" : "#9999991A",
              color: params.value ? "#6CAD61" : "#999999",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {params.value ? "Active" : "Deactivated"}
          </span>
        );
      },
    },
    {
      field: "deactivate",
      headerName: "Deactivate",
      sortable: false,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      renderCell: (params) => {
        const isActive = params?.row?.status;
        return (
          <Switch
            disabled={isUpdating}
            checked={!isActive}
            // onChange={() => {
            //   handleChange(params?.row?.id);
            // }}
          />
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/users/detail/${params?.id}`}>{HostEyeSvg}</Link>
          </>
        );
      },
    },
  ];
  const universityColumns = [
    {
      field: "name",
      headerName: "University Name",
      flex: 1.5,
      sortable: false,
    },
    {
      field: "abbrevation",
      headerName: "Abbrevation",
      sortable: false,
      flex: 1.5,
    },
    {
      field: "website",
      headerName: "Website",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <a
            href={params?.formattedValue}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              color: "black",
            }}
          >
            {params?.formattedValue}{" "}
          </a>
        );
      },
    },
    {
      field: "enrolledStudent",
      headerName: "Enrolled Students	",
      sortable: false,
      flex: 1.5,
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/university/edit/${params?.id}`}>{HostEyeSvg}</Link>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];
  const allPostColumns = [
    {
      field: "post",
      headerName: "Post",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/post/detail/${params?.id}`}>View</Link>
          </>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2.5,
      sortable: false,
    },
    {
      field: "username",
      headerName: "Username",
      sortable: true,
      flex: 1.5,
    },
    {
      field: "likes",
      headerName: "Likes",
      sortable: true,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
    },
    {
      field: "tagged",
      headerName: "Tagged",
      sortable: true,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
    },
    {
      field: "comments",
      headerName: "Comments",
      sortable: true,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
    },
    {
      field: "boosted",
      headerName: "Boosted",
      sortable: true,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];

  const boostedPostColumns = [
    {
      field: "author",
      headerName: "Author",
      flex: 1.5,
      sortable: false,
    },
    {
      field: "university",
      headerName: "Univeristy",
      sortable: true,
      flex: 1.5,
    },
    {
      field: "comments",
      headerName: "Comments",
      flex: 1.5,
      sortable: true,
    },
    {
      field: "likes",
      headerName: "Likes",
      headerAlign: "center",
      align: "center",
      sortable: true,
      flex: 1.5,
    },
    {
      field: "content",
      headerName: "Content",
      sortable: true,
      flex: 1.5,
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      sortable: true,
      align: "center",
      flex: 1.5,
    },
    {
      field: "boost",
      headerName: "Purchased Boosts",
      flex: 1.5,
      align: "center",
      sortable: false,
    },
    {
      field: "action",
      headerName: "Action",

      flex: 1.5,
      sortable: false,

      renderCell: (params) => {
        return (
          <div
            className="cursor-pointer ml-2"
            onClick={() => {
              setDeleteModal(true);
              setDeleteState(params?.row?.id);
            }}
          >
            {DeleteIcon}
          </div>
        );
      },
    },
  ];
  const allEventsColumns = [
    {
      field: "event",
      headerName: "Event",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/event/view/${params?.id}`}>View</Link>
          </>
        );
      },
    },
    {
      field: "title",
      headerName: "Title",
      sortable: true,
      align: "center",
      headerAlign: "center",
      flex: 1.5,
    },

    {
      field: "hosts",
      headerName: "Host",
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setHostModal(true);
                setEventClicked(params?.row);
                setHostedBy("Event");
              }}
            >
              {HostEyeSvg}
            </div>
          </>
        );
      },
    },
    {
      field: "startDate",
      headerName: "Start Date",
      sortable: true,
      align: "center",
      headerAlign: "center",
      flex: 1.5,
    },
    {
      field: "endDate",
      headerName: "End Date",
      sortable: true,
      align: "center",
      headerAlign: "center",
      flex: 1.5,
    },
    {
      field: "location",
      headerName: "Location",
      sortable: true,
      align: "center",
      headerAlign: "center",
      flex: 1.5,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "boosted",
      headerName: "Boosted",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      sortable: true,
    },
    {
      field: "byWepick",
      headerName: ` by Wepick`,
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderHeader: () => (
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {tickSvg}
          by Wepick
        </div>
      ),
      renderCell: (params) => {
        const isActive = params?.row?.status;
        return (
          <Switch
            checked={!isActive}
          // onChange={() => {
          //   handleChange(params?.row?.id);
          // }}
          />
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            {/* <Link to={`/event/edit/${params?.id}`}>{EditIcon}</Link> */}
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];
  const boostedEventsColumns = [
    {
      field: "event",
      headerName: "Event",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <CardHeader
            sx={{ padding: "0px" }}
            avatar={
              <Box
                sx={{
                  filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
                }}
              >
                <Avatar
                  alt="Hospital Pic"
                  src={`${params?.row?.image}`}
                  onClick={() => handleImageClick(params?.row?.image)}
                />
              </Box>
            }
            title={params?.row?.event}
          />
        );
      },
    },
    {
      field: "university",
      headerName: "Univeristy",
      sortable: true,
      align: "center",
      headerAlign: "center",
      flex: 1.5,
    },
    {
      field: "host",
      headerName: "Host",
      // headerAlign: "center",
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
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
              {params?.row?.host?.map((user) => (
                <Tooltip title={user?.name} placement="top">
                  <Avatar style={{ backgroundColor: "#87d068" }}>
                    {getInitials(user?.name)}
                  </Avatar>
                </Tooltip>
              ))}
            </Avatar.Group>
          </>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      sortable: true,
      flex: 1.5,
    },
    {
      field: "location",
      headerName: "Location",
      sortable: true,
      align: "center",
      flex: 1.5,
    },
    {
      field: "attendees",
      headerName: "No Attendees",
      flex: 1.5,
      align: "center",
      sortable: false,
    },
    {
      field: "details",
      headerName: "Details",
      flex: 1.5,
      align: "left",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Tooltip placement="topRight" title={params?.row?.details}>
              {params?.row?.details?.length > 15
                ? params?.row?.details?.slice(0, 15) + "..."
                : params?.row?.details}
            </Tooltip>
          </>
        );
      },
    },
    {
      field: "boost",
      headerName: "Purchased Boosts",
      flex: 1.5,
      align: "center",
      sortable: false,
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];
  const customComunityColumns = [
    {
      field: "username",
      headerName: "Username",
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <> {params?.row?.username}</>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      sortable: false,
      disableColumnMenu: true,
      align: "left",
      headerAlign: "left",
      flex: 2.5,
    },
    {
      field: "availableAmount",
      headerName: "Available Amount",
      sortable: false,
      disableColumnMenu: true,
      flex: 1.5,
      align: "center",
    },
    {
      field: "requestedAmount",
      headerName: "Requested Amount",
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
    },
    {
      field: "requestedDate",
      headerName: "Requested Date",
      flex: 1.5,
      align: "center",
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: "approvedDate",
      headerName: "Approved Date",
      flex: 1.5,
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <> {params?.row?.approvedDate ? params?.row?.approvedDate : "-"} </>
      ),
    },
    {
      field: "account",
      headerName: "Account",
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (param) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowAccount(param?.row?.account);
            }}
          >
            {HostEyeSvg}
          </div>
        );
      },
    },
    {
      field: "reciept",
      headerName: "Receipt",
      flex: 2,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (param) => {
        return (
          <div
            style={{
              display: "flex",
              gap: "3px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {param?.row?.receipt && fileTag}
            {param?.row?.receipt && param?.row?.receipt?.slice(51, 61) + "..."}
            <div
              onClick={() => {
                param?.row?.receipt && setShowReciept(param?.row?.receipt);
              }}
              style={{ cursor: param?.row?.receipt ? "pointer" : "no-drop" }}
            >
              {HostEyeSvg}
            </div>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      disableColumnMenu: true,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <span
            style={{
              padding: "5px 10px",
              borderRadius: "15px",
              backgroundColor:
                params.value !== "pending" ? "#F5F5F5" : "#FDE7E7",
              color: params.value !== "pending" ? "#999999" : "#E90C0C",
              textAlign: "center",
              display: "inline-block",
              cursor: params.value !== "pending" ? "no-drop" : "pointer",
            }}
            onClick={() =>
              params.value === "pending" && setShowModal(params?.id)
            }
          >
            {params.value !== "pending" ? "Approved" : "Pending"}
          </span>
        );
      },
    },
  ];

  const officialComunityColumns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return  <>{params?.row?.name}</>;
      },
      
    },
    {
      field: "admin",
      headerName: "Admin",
      sortable: true,
      align: "center",
      headerAlign: "center",
      flex: 1.5,
      renderCell: (params) => {
        return params?.row?.isOfficial ? "-" : <>{params?.row?.admin}</>;
      },
    },
    {
      field: "hosts",
      headerName: "Host",
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1.5,
      renderCell: (params) => {
        return (
          params?.row?.isOfficial ? "-":
          <>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setHostModal(true);
                setEventClicked(params?.row);
                setHostedBy("Community");
              }}
            >
              {HostEyeSvg}
            </div>
          </>
        );
      },
    },
    {
      field: "followers",
      headerName: "Followers",
      sortable: true,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
    },
    {
      field: "likes",
      headerName: "Likes",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
    {
      field: "ranking",
      headerName: "Ranking",
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      sortable: false,
    },
    {
      field: "action",
      headerName: "Action",

      flex: 1.5,
      sortable: false,

      renderCell: (params) => {
        return (
          <>
            <Link to={`/community/edit/${params?.id}`}>{HostEyeSvg}</Link>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];
  const boostsColumns = [
    {
      field: "userName",
      headerName: "Username",
      flex: 1.5,
      sortable: false,
    },
    {
      field: "email",
      headerName: "Email",
      sortable: false,
      flex: 1.5,
    },
    {
      field: "availableBoosts",
      headerName: "Available Boosts",
      sortable: true,
      flex: 1.5,
    },
    {
      field: "boostsPurchased",
      headerName: "Boosts Purchased",
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      sortable: true,
    },
    {
      field: "type",
      headerName: "Type",
      // flex: 1.5,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
  ];
  const allStoriesColumns = [
    {
      field: "story",
      headerName: "Story",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <p
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() =>
                handleImageClick(
                  params?.row?.image,
                  params?.row?.video,
                  params?.row?.description,
                  params?.row?.userProfile,
                  params?.row?.username,
                  params?.row?.storyTime
                )
              }
            >
              View
            </p>
          </>
        );
      },
    },
    {
      field: "username",
      headerName: "Username",
      sortable: false,
      flex: 1.5,
    },
    {
      field: "publishedDate",
      headerName: "Published Date",
      sortable: true,
      flex: 1.5,
    },
    {
      field: "reaction",
      headerName: "Reactions",
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      sortable: true,
      renderCell: (params) => {
        return (
          <span
            
          >
            {params?.row.reaction}
          </span>
        );
      },
    },
    {
      field: "views",
      headerName: "Views",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <span
            style={{
              padding: "5px 10px",
              borderRadius: "15px",
              backgroundColor: params.value ? "#3BAF2A1A" : "#9999991A",
              color: params.value ? "#6CAD61" : "#999999",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {params.value ? "Active" : "Expired"}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];
  const moderationsPostsColumns = [
    {
      field: "post",
      headerName: "Post",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <p
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() =>
                navigate(`/moderation/posts/post/${params.id}`, {
                  state: { from: "/moderation/posts" },
                })
              }
            >
              View
            </p>
          </>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      sortable: false,
      flex: 1.5,
    },
    {
      field: "username",
      headerName: "Username",
      sortable: true,
      flex: 1.5,
    },
    {
      field: "reports",
      headerName: "Reports",
      flex: 1.5,
      sortable: true,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <p>{params?.row?.reports}</p>
              <Link
                to={`/reportdetails`}
                state={{ row: params.row, backRoute: "posts" }}
              >
                {HostEyeSvg}
              </Link>
            </div>
          </>
        );
      },
    },
    {
      field: "remove",
      headerName: "Remove",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];

  const moderationsEventsColumns = [
    {
      field: "images",
      headerName: "Event",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <p
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() =>
                navigate(`/event/view/${params.id}`, {
                  state: { from: "/moderation/events" },
                })
              }
            >
              View
            </p>
          </>
        );
      },
    },
    {
      field: "title",
      headerName: "Title",
      sortable: false,
      flex: 1.5,
    },
    // {
    //   field: "host",
    //   headerName: "Hosts",
    //   sortable: true,
    //   flex: 1.5,
    // },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1.5,
      sortable: true,
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1.5,
      sortable: true,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1.5,
      sortable: true,
    },
    {
      field: "reports",
      headerName: "Reports",
      flex: 1.5,
      sortable: true,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <p>{params?.row?.reports}</p>
              <Link
                to={`/reportdetails`}
                state={{ row: params.row, backRoute: "events" }}
              >
                {HostEyeSvg}
              </Link>
            </div>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];
  const moderationsStoriesColumns = [
    {
      field: "images",
      headerName: "Images",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <p
              style={{ cursor: "pointer",color: "#007bff"  }}
              onClick={() =>
                handleImageClick(
                  params?.row?.image,
                  params?.row?.video,
                  params?.row?.description,
                  params?.row?.userProfile,
                  params?.row?.username,
                  params?.row?.storyTime
                )
              }
            >
              View
            </p>
          </>
        );
      },
    },
    {
      field: "username",
      headerName: "Username",
      sortable: false,
      flex: 1.5,
    },
    {
      field: "email",
      headerName: "Email",
      sortable: true,
      flex: 1.5,
    },
    {
      field: "reports",
      headerName: "Reports",
      flex: 1.5,
      sortable: true,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <p>{params?.row?.reports}</p>
              <Link
                to={`/reportdetails`}
                state={{ row: params.row, backRoute: "stories" }}
              >
                {HostEyeSvg}
              </Link>
            </div>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];
  const moderationsUsersColumns = [
    {
      field: "user",
      headerName: "User",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"

            // onClick={() => {
            //   setHostModal(true);
            //   setEventClicked(params?.row);
            //   setHostedBy("Event");
            // }}
            >
              {moderationUsers}
            </div>
          </>
        );
      },
    },
    {
      field: "username",
      headerName: "Username",
      sortable: false,
      flex: 1.5,
    },
    {
      field: "email",
      headerName: "Email",
      sortable: true,
      flex: 1.5,
    },
    {
      field: "reports",
      headerName: "Reports",
      flex: 1.5,
      sortable: true,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <p>{params?.row?.reports}</p>
              <Link
                to={`/reportdetails`}
                state={{ row: params.row, backRoute: "users" }}
              >
                {HostEyeSvg}
              </Link>
            </div>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];
  const questionsColumn = [
    {
      field: "questiondetail",
      headerName: "Question",
      flex: 1.5,
      sortable: false,
    },
    {
      field: "username",
      headerName: "Username",
      sortable: false,
      flex: 1.5,
    },
    {
      field: "email",
      headerName: "Email",
      sortable: true,
      flex: 1.5,
    },
    {
      field: "reports",
      headerName: "Reports",
      flex: 1.5,
      sortable: true,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <p>{params?.row?.reports}</p>
              <Link
                to={`/reportdetails`}
                state={{ row: params.row, backRoute: "questions" }}
              >
                {HostEyeSvg}
              </Link>
            </div>
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];
  const communitiesColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      sortable: false,
    },
    {
      field: "admin",
      headerName: "Admin",
      sortable: false,
      flex: 1.5,
    },
    {
      field: "reports",
      headerName: "Reports",
      flex: 1.5,
      sortable: true,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <p>{params?.row?.reports}</p>
              <Link
                to={`/reportdetails`}
                state={{ row: params.row, backRoute: "communities" }}
              >
                {HostEyeSvg}
              </Link>
            </div>
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];
  const commentsColumn = [
    {
      field: "post",
      headerName: "Post",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {/* <Link to={`/post/detail/${params?.id}`}>View</Link> */}
            <p style={{ cursor: "pointer" }}>View</p>
          </>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      sortable: false,
      flex: 1.5,
    },
    {
      field: "username",
      headerName: "Username",
      sortable: true,
      flex: 1.5,
    },
    {
      field: "reports",
      headerName: "Reports",
      flex: 1.5,
      sortable: true,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <p>{params?.row?.reports}</p>
              <Link
                to={`/reportdetails`}
                state={{ row: params.row, backRoute: "comments" }}
              >
                {HostEyeSvg}
              </Link>
            </div>
          </>
        );
      },
    },
    {
      field: "comment",
      headerName: "Comment",
      flex: 1.5,
      align: "left",
      sortable: true,
    },

    {
      field: "remove",
      headerName: "Remove",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer ml-2"
              onClick={() => {
                setDeleteModal(true);
                setDeleteState(params?.row?.id);
              }}
            >
              {DeleteIcon}
            </div>
          </>
        );
      },
    },
  ];

  const reportsColoumn = [
    {
      field: "hash",
      headerName: "#",
      flex: 1.5,
      sortable: false,
    },

    {
      field: "username",
      headerName: "Username",
      flex: 1.5,
      sortable: false,
    },
    {
      field: "email",
      headerName: "Email",
      sortable: false,
      flex: 1.5,
    },
    {
      field: "university",
      headerName: "University",
      flex: 1.5,
      sortable: false,
    },
    {
      field: "reason",
      headerName: "Reason",
      sortable: true,
      flex: 1.5,
    },
  ];

  const loadTable = async () => {
    setLoading(true);

    switch (index) {
      case 0:
        setColumns(userColumns);
        const temp = data;
        let output = [];
        for (let i = 0; i < temp?.length; i++) {
          output.push({
            id: temp[i]["_id"],
            name: temp[i]["Name"],
            email: temp[i]["email"],
            university: temp[i]["university"]?.universityName,
            likes: temp[i]["likesCount"],
            post: temp[i]["postsCount"],
            friends: temp[i]["friendCount"],
            course: temp[i]["department"],
            status: temp[i]["status"],
            isAnonymous: temp[i]["isAnonymous"],
            userName: temp[i]["userName"],
          });
        }
        setRows(output);
        break;
      case 1:
        const tempUni = data;
        setColumns(universityColumns);
        let outputUserData = [];
        for (let i = 0; i < tempUni?.length; i++) {
          outputUserData.push({
            id: tempUni[i]["_id"],
            name: tempUni[i]["universityName"],
            abbrevation: tempUni[i]["universityAbbreviation"],
            location: tempUni[i]["address"],
            website: tempUni[i]["websiteURL"],
            enrolledStudent: tempUni[i]["enrolledStudent"],
          });
        }
        setRows(outputUserData);
        break;
      case 2:
        //const tempAlPost = allPostData
        const tempAlPost = data;
        // const user = data?.user;
        setColumns(allPostColumns);
        let outputAlPostData = [];
        for (let i = 0; i < tempAlPost?.length; i++) {
          outputAlPostData.push({
            id: tempAlPost[i]["_id"],
            // post: ["view"],
            username: tempAlPost[i]?.user?.userName,
            email: tempAlPost[i]?.user?.email,
            university: tempAlPost[i]["community"]?.communityName,
            // comments: "23",
            likes: tempAlPost[i]["likeCounter"],
            tagged: tempAlPost[i]["taggedPeopleCount"],
            comments: tempAlPost[i]["commentCount"],
            boosted: tempAlPost[i]["boostCount"],
            content: tempAlPost[i]["description"],

            timestamp: moment(tempAlPost[i]["createdAt"]).format(
              "DD-MM-YYYY HH:MM"
            ),
          });
        }
        setRows(outputAlPostData);
        break;
      case 3:
        // const tempBostPost = boostedPost;
        const tempBostPost = data;

        setColumns(boostedPostColumns);
        let outputBostPostData = [];
        for (let i = 0; i < tempBostPost?.length; i++) {
          outputBostPostData.push({
            id: tempBostPost[i]["_id"],
            author: tempBostPost[i]["user"]?.userName,
            boost: tempBostPost[i]["boostCount"],
            university:
              tempBostPost[i]["user"]?.university?.universityAbbreviation,
            comments: tempBostPost[i]["commentCount"],
            likes: tempBostPost[i]["likeCounter"],
            content: tempBostPost[i]["description"],
            timestamp: moment(tempBostPost[i]["createdAt"]).format(
              "DD-MM-YYYY HH:MM"
            ),
          });
        }
        setRows(outputBostPostData);
        break;
      case 4:
        // const tempAlEvent = allEventData
        const tempAlEvent = data;
        const extractDate = (datetimeString) => {
          // Parse the datetime string with moment
          const date = moment(datetimeString);

          // Format the date as YYYY-MM-DD
          return date.format("DD-MM-YYYY");
        };
        setColumns(allEventsColumns);
        let outputAlEventData = [];
        for (let i = 0; i < tempAlEvent?.length; i++) {
          outputAlEventData.push({
            id: tempAlEvent[i]["_id"],
            title: tempAlEvent[i]["eventName"],
            hosts: tempAlEvent[i]?.hosts,
            startDate: extractDate(tempAlEvent[i]["startDateAndTime"]),
            endDate: extractDate(tempAlEvent[i]["endDateAndTime"]),
            location: tempAlEvent[i]["location"],
            boosted: tempAlEvent[i]["boostCount"],
            type:
              tempAlEvent[i]?.isAnonymous === false ? "Public" : "Anonymous",
          });
        }
        setRows(outputAlEventData);
        break;
      case 5:
        // const tempBostEvent = boostedEventData;
        const tempBostEvent = data;

        setColumns(boostedEventsColumns);
        let outputBostEventData = [];
        for (let i = 0; i < tempBostEvent?.length; i++) {
          outputBostEventData.push({
            id: tempBostEvent[i]["_id"],
            event: tempBostEvent[i]["eventName"],
            university: tempBostEvent[i]["university"],
            host: tempBostEvent[i]["hosts"],
            timestamp: moment(tempBostEvent[i]["createdAt"])?.format(
              "DD-MM-YYYY HH:MM"
            ),
            content: tempBostEvent[i]["description"],
            location: tempBostEvent[i]["location"],
            attendees: tempBostEvent[i]["attendees"],
            boost: tempBostEvent[i]["boostCount"],
            details: tempBostEvent[i]["detail"],
            image: tempBostEvent[i]["imgurl"],
          });
        }
        setRows(outputBostEventData);
        break;
      case 6:
        setColumns(customComunityColumns);

        if (!data) return;

        setRows(
          data?.map((request) => ({
            id: request?._id,
            username: request?.user?.userName,
            email: request?.user?.email,
            availableAmount: request?.availableBalance,
            requestedAmount: request?.requestedBalance,
            requestedDate: moment(request?.requestedDate)?.format("DD-MM-YYYY"),
            approvedDate:
              request?.approvedDate &&
              moment(request?.approvedDate)?.format("DD-MM-YYYY"),
            receipt: request?.receipt,
            status: request?.status,
            account: {
              bankName: request?.account?.bankName,
              accountNo: request?.account?.accountNo,
              ownerName: request?.account?.ownerName,
            },
          }))
        );
        break;

      case 7:
        // const tempOfficialComunity = officialCommunityData;
        const tempOfficialComunity = data;

        setColumns(officialComunityColumns);
        let outputOfficialComunityData = [];
        for (let i = 0; i < tempOfficialComunity?.length; i++) {
          outputOfficialComunityData.push({
            id: tempOfficialComunity[i]["_id"],
            name: tempOfficialComunity[i]["communityName"],
            banner: tempOfficialComunity[i]["banner"],
            bio: tempOfficialComunity[i]["bio"],
            followers: tempOfficialComunity[i]["followerCount"],
            likes: tempOfficialComunity[i]["totalLikes"],
            admin: tempOfficialComunity[i]["createdBy"]?.["userName"],
            members: tempOfficialComunity[i]["hosts"],
            ranking: tempOfficialComunity[i]["rankNo"],
            host: tempOfficialComunity[i]["hosts"],
            image: tempOfficialComunity[i]["image"],
            isOfficial:tempOfficialComunity[i]["isOfficial"]
          });  
        }
        setRows(outputOfficialComunityData);
        break;
      case 8:
        const tempStoryCommunity = data ? data : [];
          
        setColumns(allStoriesColumns);
        let outputStoryData = [];
        tempStoryCommunity.forEach((community) => {
          if (community?.stories?.length > 0) {
            community.stories.forEach((story) => {  
              outputStoryData.push({
                id: story?._id,
                username: community?.user?.userName,
                userProfile: community?.user?.profileImage,
                views: story?.viewedBy?.length || 0,
                publishedDate: moment(story?.createdAt).format("DD-MM-YYYY"),
                storyTime: moment(story?.createdAt).fromNow(),
                university: community?.user?.university?.universityName,
                description: story?.description,
                image: story?.images,
                video: story?.videoref,
                status: calculateStatus(story?.createdAt),
                reaction:story.allReactionDetails[0]?.count || 0
              });
            });
          }
        });
        setRows(outputStoryData);

        break;
      case 9:
        const tempBoosts = data;
        setColumns(boostsColumns);
        let outputBoosts = [];
        for (let i = 0; i < tempBoosts?.length; i++) {
          outputBoosts.push({
            id: tempBoosts[i]["_id"],
            userName: tempBoosts[i]["user"]?.userName,
            email: tempBoosts[i]["user"]?.email,
            availableBoosts: tempBoosts[i]["count"],
            boostsPurchased: tempBoosts[i]["purchasedCount"],
            type: tempBoosts[i]["type"],
          });
        }
        setRows(outputBoosts);
        break;
      case 11:
        const tempModerationsPosts = data;
        setColumns(moderationsPostsColumns);
        let outputModerationsPostsData = [];
        for (let i = 0; i < tempModerationsPosts?.length; i++) {
          outputModerationsPostsData.push({
            id: tempModerationsPosts[i]?.["postId"],
            email: tempModerationsPosts[i]?.postDetails?.["email"],
            username: tempModerationsPosts[i]?.postDetails?.["userName"],
            reports: tempModerationsPosts[i]?.["reportCount"],
            report: tempModerationsPosts[i]?.reports,
          });
        }
        setRows(outputModerationsPostsData);
        break;

      case 12:
        const tempModerationsEvents = data;
        setColumns(moderationsEventsColumns);
        let outputModerationsEventsData = [];
        for (let i = 0; i < tempModerationsEvents?.length; i++) {
          outputModerationsEventsData.push({
            id: tempModerationsEvents[i]["eventId"],
            title: tempModerationsEvents[i]?.eventDetails?.["eventName"],
            // host: tempModerationsEvents[i]?.eventDetails?.["userName"],
            reports: tempModerationsEvents[i]["reportCount"],
            startDate: moment(
              tempModerationsEvents[i]?.eventDetails?.["startDateAndTime"]
            ).format("DD-MM-YYYY"),
            endDate: moment(
              tempModerationsEvents[i]?.eventDetails?.["endDateAndTime"]
            ).format("DD-MM-YYYY"),
            location: tempModerationsEvents[i]?.eventDetails?.["location"],
            report: tempModerationsEvents[i]?.reports,
          });
        }
        setRows(outputModerationsEventsData);
        break;
      case 13:
        const tempModerationsStories = data;
        setColumns(moderationsStoriesColumns);
        let outputModerationsStoriessData = [];
        for (let i = 0; i < tempModerationsStories?.length; i++) {
          outputModerationsStoriessData.push({
            id: tempModerationsStories[i]["storyId"],
            username: tempModerationsStories[i]?.storyDetails?.["userName"],
            email: tempModerationsStories[i]?.storyDetails?.["email"],
            reports: tempModerationsStories[i]?.["reportCount"],
            report: tempModerationsStories[i]?.reports,
          });
        }
        setRows(outputModerationsStoriessData);
        break;
      case 14:
        const tempModerationsUsers = data;
        setColumns(moderationsUsersColumns);
        let outputModerationsUserssData = [];
        for (let i = 0; i < tempModerationsUsers?.length; i++) {
          outputModerationsUserssData.push({
            id: tempModerationsUsers[i]["userId"],
            user: tempModerationsUsers[i]["image"],
            username: tempModerationsUsers[i]?.userDetails["userName"],
            email: tempModerationsUsers[i]?.userDetails["email"],
            reports: tempModerationsUsers[i]["reportCount"],
            report: tempModerationsUsers[i]?.reports,
          });
        }
        setRows(outputModerationsUserssData);
        break;
      case 15:
        const tempQuestionsData = data;
        setColumns(questionsColumn);
        let outputQuestionsData = [];
        for (let i = 0; i < tempQuestionsData?.length; i++) {
          outputQuestionsData?.push({
            id: tempQuestionsData[i]["questionId"],
            questiondetail: tempQuestionsData[i]?.questionDetails?.["question"],
            username: tempQuestionsData[i]?.questionDetails?.["userName"],
            email: tempQuestionsData[i]?.questionDetails?.["email"],
            reports: tempQuestionsData[i]["reportCount"],
            report: tempQuestionsData[i]?.reports,
          });
        }
        setRows(outputQuestionsData);
        break;
      case 16:
        const tempCommunitiesData = data;
        setColumns(communitiesColumn);
        let outputCommunitiesData = [];
        for (let i = 0; i < tempCommunitiesData?.length; i++) {
          outputCommunitiesData.push({
            id: tempCommunitiesData[i]["communityId"],
            admin: tempCommunitiesData[i]?.communityDetails?.["adminName"],
            reports: tempCommunitiesData[i]["reportCount"],
            views: tempCommunitiesData[i]["viewedBy"]?.length,
            date: moment(tempCommunitiesData[i]["createdAt"]).format(
              "DD-MM-YYYY HH:MM"
            ),
            boost: tempCommunitiesData[i]["boostCount"],

            image: tempCommunitiesData[i]["images"],
            report: tempCommunitiesData[i]?.reports,
          });
        }
        setRows(outputCommunitiesData);
        break;
      case 17:
        const tempCommentsData = data;
        setColumns(commentsColumn);
        let outputCommentsData = [];
        for (let i = 0; i < tempCommentsData?.length; i++) {
          outputCommentsData.push({
            id: tempCommentsData[i]["commentId"],
            email: tempCommentsData[i]?.commentDetails?.["email"],
            username: tempCommentsData[i]?.commentDetails?.["userName"],
            reports: tempCommentsData[i]["reportCount"],
            comment: tempCommentsData[i]?.commentDetails?.["content"],
            report: tempCommentsData[i]?.reports,
          });
        }
        setRows(outputCommentsData);
        break;
      case 18:
        const tempReportsData = data;
        setColumns(reportsColoumn);
        let outputReportsData = [];
        for (let i = 0; i < tempReportsData?.length; i++) {
          outputReportsData.push({
            id: tempReportsData[i]["_id"],
            hash: i + 1,
            username: tempReportsData[i]?.userDetails?.["userName"],
            email: tempReportsData[i]?.userDetails?.["email"],
            university:
              tempReportsData[i]?.universityDetails?.["universityName"],
            reason: tempReportsData[i]["reason"],
            // comment: tempReportsData[i]?.commentDetails?.["content"],
          });
        }
        setRows(outputReportsData);
        break;
      default:
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadTable();
  }, [index, loader]);

  const getDeleteMessage = () => {
    switch (index) {
      case 1:
        return "Do you really want to delete this university?";
      case 2:
        return "Do you really want to delete this post?";
      case 4:
        return "Do you really want to delete this event?";
      case 7:
        return "Do you really want to delete this community?";
      default:
        return "Do you really want to delete this item?";
    }
  };

  return (
    <div>
      <ImagePreview
        imagePreviewUrl={previewData.image}
        videoUrl={previewData.video}
        description={previewData.description}
        closeImagePreview={closeImagePreview}
        isPreviewOpen={isPreviewOpen}
        userProfile={previewData.userProfile}
        userName={previewData.userName}
        storyTime={previewData.storyTime}
      />
      <ConfirmationModal
        show={deleteModal}
        handleClose={() => setDeleteModal(false)}
        loading={isLoading}
        message={getDeleteMessage()}
      />
      <EventHostModal
        show={hostModal}
        handleClose={() => setHostModal(false)}
        loading={isLoading}
        data={eventClicked}
        hostedBy={hostedBy}
        getData={getData}
      />
      <UploadImageModal
        showModal={showModal}
        handleClose={() => setShowModal(null)}
        loading={isLoading}
        onFileUpload={handleFileUpload}
        setFilterState={setFilterState}
      />
      <RecieptView
        showReciept={showReciept}
        handleClose={() => setShowReciept(null)}
        rows={rows}
      />
      <AccountView
        showAccount={showAccount}
        handleClose={() => setShowAccount(null)}
      />
      {loader ? (
        <DataGridSkeleton
          totalRow={rows?.length || 10}
          totalCol={columns?.length || 10}
          image={false}
          header={columns}
        />
      ) : (
        <DataGrid
          style={{ backgroundColor: "white" }}
          rows={rows}
          columns={columns}
          localeText={{ noRowsLabel: "No data found" }}
        />
      )}
    </div>
  );
};
export default DG;
