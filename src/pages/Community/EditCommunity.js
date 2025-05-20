import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  editCommunity,
  editEvent,
  getCommunityById,
  getUser,
} from "../../services/service.js";
import { Box, CircularProgress } from "@mui/material";
import { CustomToast } from "../../atoms/toastMessage/index.js";
import CustomButton from "../../atoms/CustomButton/CustomButton.js";
import ListHeader from "../../molecules/ListHeader/ListHeader.js";
import { CiSearch } from "react-icons/ci";
import dummy from "../../assets/images/university/dummy-profile.svg";
import ImageUpload from "../../components/University/ImageUpload.jsx";
import TagInput from "../../components/University/TagInput.jsx";
import Suggestion from "../../components/University/Suggestion.jsx";
import CommunityForm from "./CommunityForm.js";
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

const EditCommunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hosts, setHosts] = useState([]);
  const [tagInputValue, setTagInputValue] = useState("");
  const [hostInputValue, setHostInputValue] = useState("");
  const [bannerImage, setBgImage] = useState({ file: null, imageUrl: "" });
  const [profileImage, setProfileImage] = useState({
    file: null,
    imageUrl: "",
  });

  const formik = useFormik({
    initialValues: {
      communityName: "",
      bio: "",
      host: [],
      tags: [],
    },
    // validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("communityName", values.communityName);
      formData.append("bio", values.bio);

      tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });

      hosts.forEach((host, index) => {
        formData.append(`host[${index}]`, host._id);
      });

      if (profileImage.file) {
        formData.append("profileImage", profileImage.file);
      }

      if (bannerImage.file) {
        formData.append("bannerImage", bannerImage.file);
      }

      try {
        let response;

        response = await editCommunity(id, formData);

        if (response) {
          CustomToast({
            type: "success",
            message: "Community updated successfully",
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
    setLoader(true);
    try {
      const response = await getUser(page, limit);
      if (response) {
        setUser(response?.data);
        setTotalUsers(response?.pagination.totalCount);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        setLoader(true);
        try {
          const response = await getCommunityById({ id });
          if (response) {
            const community = response?.data;
            formik.setValues({
              communityName: community?.communityName || "",
              bio: community.bio || "",
              host: community.hosts || [],
            });
            setHosts(community.hosts || []);
            setTags(community.tags || []);
            setBgImage({
              file: null,
              imageUrl: community.bannerImageUrl || "",
            });
            setProfileImage({
              file: null,
              imageUrl: community.profileImageUrl || "",
            });
          }
          handlegetUserData();
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
              linkBreadCrum="/officialcommunity"
              blinkBreadCrumText="Communities"
              blinkBreadCrumText1="Community Details"
              searchShow={false}
            />
          </div>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="px-2">
          <ImageUpload
            bgImage={bannerImage}
            handleUpload={handleUpload}
            setBgImage={setBgImage}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            uploadProfile={true}
          />
          <CommunityForm formik={formik} id={id} />

          <div className="course-section">
            <p className="course-heading"> {id ? "Tags" : "Add Tags"}</p>
            <TagInput
              tags={tags}
              setTags={setTags}
              handleRemoveItem={handleRemoveItem}
              tagInputValue={tagInputValue}
              setTagInputValue={setTagInputValue}
              handleKeyDown={handleKeyDown}
              handleAddItem={handleAddItem}
              placeholder="Add Tags"
              id={!id}
            />
            {!id && (
              <Suggestion
                title={"Suggested Tags:"}
                data={suggestionsData}
                handleAddItem={(value) =>
                  handleAddItem(value, setTagInputValue, tags, setTags)
                }
              />

            )}

          </div>
          {id && (
            <div className="course-section hosts">
              <p className="course-heading"> {id ? "Host" : "Add Hosts"}</p>
              <TagInput
                placeholder="Add Hosts"
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
              {!id && (
                <div className="search-container">
                  <input
                    type="text"
                    className="search-hosts"
                    placeholder="Search user by name, email, username "
                    value={hostInputValue}
                    onChange={(e) => setHostInputValue(e.target.value)}
                  />

                  <CiSearch className="search-icon" />
                </div>
              )}
              {!id && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {user?.map((host) => (
                    <div
                      key={host.id}
                      className="hosts-container"
                      onClick={() => handleAddHost(host)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="image-parent">
                        <img
                          className="user-image"
                          src={host?.profileImage ? host?.profileImage : dummy}
                          alt="user"
                        />
                      </div>
                      <p className="user-name">{host?.userName}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
          {!id && (
            <div>
              <CustomButton
                text={isLoading ? <ButtonLoader /> : "Save"}
                backgroundColor={"#0D0D0D"}
                textColor={"white"}
                padding={"5px 1.5rem"}
                marginLeft={"0.5rem"}
                marginTop={"1rem"}
                type="submit"
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditCommunity;
