import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  editEvent,
  getEventById,
  getUser,
  seacrhUser,
} from "../../services/service.js";
import { Box, CircularProgress } from "@mui/material";
import { CustomToast } from "../../atoms/toastMessage/index.js";
import CustomButton from "../../atoms/CustomButton/CustomButton.js";
import ListHeader from "../../molecules/ListHeader/ListHeader.js";
import { CiSearch } from "react-icons/ci";
import dummy from "../../assets/images/university/dummy-profile.svg";
import ImageUpload from "../../components/University/ImageUpload.jsx";
import EventsForm from "./EventsForm.js";
import TagInput from "../../components/University/TagInput.jsx";
import Suggestion from "../../components/University/Suggestion.jsx";
import ButtonLoader from "../../atoms/buttonLoader/index.js";
import PageLoader from "../../components/common/PageLoader.js";

const suggestionsData = [
  { name: "Computer" },
  { name: "English" },
  { name: "Mathematics" },
  { name: "Physics" },
  { name: "Chemistry" },
];

// const validationSchema = Yup.object().shape({
//   eventName: Yup.string().required("Event Name is required"),
//   startDateAndTime: Yup.string().required("Start Date and Time is required"),
//   endDateAndTime: Yup.string().required("End Date and Time is required"),
//   location: Yup.string().required("Location is required"),
//   address: Yup.string().required("Address is required"),
//   detail: Yup.string().required("Detail is required"),
//   phoneNo: Yup.string().required("Phone Number is required"),
//   host: Yup.array().of(
//     Yup.object().shape({
//       _id: Yup.string().required(),
//     })
//   ),
// });

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [loadingMoreUsers, setLoadingMoreUsers] = useState(false);
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hosts, setHosts] = useState([]);
  const [tagInputValue, setTagInputValue] = useState("");
  const [hostInputValue, setHostInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bgImage, setBgImage] = useState({ file: null, imageUrl: "" });
  const [profileImage, setProfileImage] = useState({
    file: null,
    imageUrl: "",
  });
  const [limit] = useState(10);
  const observer = useRef();

  const formik = useFormik({
    initialValues: {
      eventName: "",
      startDateAndTime: "",
      endDateAndTime: "",
      location: "",
      address: "",
      detail: "",
      phoneNo: "",
      host: [],
    },
    // validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("eventName", values.eventName);
      formData.append("startDateAndTime", values.startDateAndTime);
      formData.append("endDateAndTime", values.endDateAndTime);
      formData.append("location", values.location);
      formData.append("address", values.address);
      formData.append("detail", values.detail);
      formData.append("phoneNo", values.phoneNo);

      tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });

      hosts.forEach((host, index) => {
        formData.append(`host[${index}]`, host._id);
      });

      if (bgImage.file) {
        formData.append("banner_image", bgImage.file);
      }

      try {
        let response;
        if (id) {
          response = await editEvent(id, formData);
        }
        if (response) {
          CustomToast({
            type: "success",
            message: id
              ? "Event updated successfully"
              : "Event created successfully",
          });
          setIsLoading(false);
        }
        navigate(-1);
      } catch (error) {
        console.error("Error fetching user data:", error);
        CustomToast({
          type: "error",
          message: error?.response?.data?.message,
        });
        setIsLoading(false);
      } finally {
        setLoader(false);
        setIsLoading(false);
      }
    },
  });

  const handlegetUserData = async (limit, page) => {
    if (page === 1) setLoader(true);
    else setLoadingMoreUsers(true); // Set loadingMoreUsers when fetching more users
    try {
      const response = await getUser(page, limit);
      if (response) {
        if (!searchQuery) {
          setUser((prevUsers) => [...prevUsers, ...response?.data]);
          setTotalUsers(response?.pagination.totalCount);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      if (page === 1) setLoader(false);
      else setLoadingMoreUsers(false); // Unset loadingMoreUsers after fetching
    }
  };

  const lastUserElementRef = useCallback(
    (node) => {
      if (loadingMoreUsers) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && user.length < totalUsers) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMoreUsers, user.length, totalUsers]
  );

  const handleSearchUser = async (query, page, limit) => {
    try {
      const response = await seacrhUser(query, page, limit);
      if (response) {
        console.log("search response", response?.data);
        setUser(response?.data);
        setTotalUsers(response?.pagination.totalCount);
      }
    } catch (error) {
      console.error("Error searching user data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const debounceTimer = setTimeout(() => {
        handleSearchUser(searchQuery, page, limit);
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else {
      handlegetUserData(limit, page);
    }
  }, [searchQuery, limit, page]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
    setPage(1);
  };

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        setLoader(true);
        try {
          const response = await getEventById({ id });
          if (response) {
            const event = response?.data;
            formik.setValues({
              eventName: event.eventName || "",
              startDateAndTime: event.startDateAndTime
                ? new Date(event.startDateAndTime).toISOString().split("T")[0]
                : "",
              endDateAndTime: event.endDateAndTime
                ? new Date(event.endDateAndTime).toISOString().split("T")[0]
                : "",
              location: event.location || "",
              address: event.address || "",
              detail: event.detail || "",
              phoneNo: event.phoneNo || "",
              host: event.hosts || [],
            });
            setHosts(event.hosts || []);
            setTags(event.tags || []);
            setBgImage({
              file: null,
              imageUrl: event.imgurl || "",
            });
          }
          handlegetUserData(limit, page);
        } catch (error) {
          console.error("Error fetching event data:", error);
        } finally {
          setLoader(false);
        }
      };
      fetchEvent();
    }
  }, [id]);

  const handleAddItem = (value, setValue, items, setItems) => {
    if (value.trim()) {
      setItems([...items, value.trim()]);
      setValue("");
    }
  };

  const handleKeyDown = (e, value, setValue, items, setItems) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem(value, setValue, items, setItems);
    }
  };

  const handleRemoveItem = (index, items, setItems) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleUpload = (event, setterFn) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setterFn({ file, imageUrl });
    }
  };

  const handleAddHost = (host) => {
    if (host && !hosts.some((h) => h?._id === host?._id)) {
      setHosts([...hosts, host]);
    }
  };

  //loading
  if (loader) {
    return <PageLoader />;
  }

  return (
    <div style={{ width: "100%", paddingBottom: "2rem" }}>
      <div className="mb-3">
        <div className="row  px-2 pt-4 ">
          <div className="col-12  ">
            <ListHeader
              placeholder="Search user by name, email, university or Course"
              linkBreadCrum="/university"
              blinkBreadCrumText="Events"
              blinkBreadCrumText1="Event Details"
              handleSearchChange={() => console.log("hello")}
              searchShow={false}
            />
          </div>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
          <ImageUpload
            bgImage={bgImage}
            handleUpload={handleUpload}
            setBgImage={setBgImage}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            uploadProfile={false}
          />
          <EventsForm formik={formik} />

          <div className="course-section">
            <p className="course-heading">Add Tags</p>
            <TagInput
              tags={tags}
              setTags={setTags}
              handleRemoveItem={handleRemoveItem}
              tagInputValue={tagInputValue}
              setTagInputValue={setTagInputValue}
              handleKeyDown={handleKeyDown}
              handleAddItem={handleAddItem}
              placeholder="Add Tags"
            />

            <Suggestion
              title={"Suggested Tags:"}
              data={suggestionsData}
              handleAddItem={(value) =>
                handleAddItem(value, setTagInputValue, tags, setTags)
              }
            />
          </div>
          {id && (
            <div className="course-section hosts">
              <p className="course-heading">Add Hosts</p>
              <TagInput
                tags={hosts.map((host) => host?.userName)}
                setTags={(names) => {
                  setHosts(
                    names.map((name, index) => ({
                      id: hosts[index]?._id || index,
                      userName: name,
                    }))
                  );
                }}
                handleRemoveItem={(index) =>
                  handleRemoveItem(index, hosts, setHosts)
                }
                tagInputValue={hostInputValue}
                setTagInputValue={setHostInputValue}
                handleKeyDown={(e) =>
                  handleKeyDown(
                    e,
                    hostInputValue,
                    setHostInputValue,
                    hosts.map((host) => host.userName),
                    (names) => {
                      setHosts(
                        names.map((name, index) => ({
                          id: hosts[index]?.id || index,
                          userName: name,
                        }))
                      );
                    }
                  )
                }
                handleAddItem={(value) =>
                  handleAddItem(
                    value,
                    setHostInputValue,
                    hosts.map((host) => host.userName),
                    (names) => {
                      setHosts(
                        names.map((name, index) => ({
                          id: hosts[index]?.id || index,
                          userName: name,
                        }))
                      );
                    }
                  )
                }
              />
              <div className="search-container">
                <input
                  type="text"
                  className="search-hosts"
                  placeholder="Search user by name, email, username "
                  // value={hostInputValue}
                  onChange={handleSearchChange}
                />
                <CiSearch className="search-icon" />
              </div>
              {user?.length === 0 ? (
                <h4>No user found</h4>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    maxHeight: "400px",
                    overflowY: "scroll",
                  }}
                >
                  {user?.map((host, index) => {
                    if (index === user.length - 1) {
                      return (
                        <div
                          ref={lastUserElementRef}
                          key={host.id}
                          className="hosts-container"
                          onClick={() => handleAddHost(host)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="image-parent">
                            <img
                              className="user-image"
                              src={
                                host?.profileImage ? host?.profileImage : dummy
                              }
                              alt="user"
                            />
                          </div>
                          <p className="user-name">{host?.userName}</p>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={host.id}
                          className="hosts-container"
                          onClick={() => handleAddHost(host)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="image-parent">
                            <img
                              className="user-image"
                              src={
                                host?.profileImage ? host?.profileImage : dummy
                              }
                              alt="user"
                            />
                          </div>
                          <p className="user-name">{host?.userName}</p>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          )}

          <div>
            <CustomButton
              text={isLoading ? <ButtonLoader /> : "Save"}
              backgroundColor={"#0D0D0D"}
              textColor={"white"}
              padding={"12px 7.5rem"}
              marginLeft={"0.5rem"}
              marginTop={"1rem"}
              type="submit"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
