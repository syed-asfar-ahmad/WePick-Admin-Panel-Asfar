import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageUpload from "./ImageUpload.jsx";
import TagInput from "./TagInput.jsx";
import UniversityForm from "./UniversityForm.jsx";
import CouseSection from "./ContactForm.jsx";
import Suggestion from "./Suggestion.jsx";
import {
  createUniversity,
  editUniversity,
  getUniversityById,
  getUser,
  seacrhUser,
} from "../../services/service.js";
import { Box, CircularProgress } from "@mui/material";
import { CustomToast } from "../../atoms/toastMessage/index.js";
import CustomButton from "../../atoms/CustomButton/CustomButton.js";
import ListHeader from "../../molecules/ListHeader/ListHeader.js";
import ButtonLoader from "../../atoms/buttonLoader/index.js";
import schemas from "../../formsvalidation/schema.js";
import PageLoader from "../common/PageLoader.js";

const suggestionsData = [
  {
    name: "Computer",
  },
  {
    name: "English",
  },
  {
    name: "Mathematics",
  },
  {
    name: "Physics",
  },
  {
    name: "Chemistry",
  },
];

const EditUniversity = () => {
  const { id } = useParams();
  console.log(id, "ssssssss")
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hosts, setHosts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tagInputValue, setTagInputValue] = useState("");
  const [hostInputValue, setHostInputValue] = useState("");
  const [bgImage, setBgImage] = useState({ file: null, imageUrl: "" });
  const [profileImage, setProfileImage] = useState({
    file: null,
    imageUrl: "",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const observer = useRef();

  const formik = useFormik({
    initialValues: {
      universityName: "",
      websiteURL: "",
      universityAbbreviation: "",
      universityDomain: "",
      aboutUniversity: "",
      email: "",
      phoneNo: "",
      address: "",
      host: [],
    },
    validationSchema: schemas?.university,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("universityName", values?.universityName);
      formData.append("websiteURL", values?.websiteURL);
      formData.append("universityAbbreviation", values?.universityAbbreviation);
      formData.append("universityDomain", values?.universityDomain);
      formData.append("aboutUniversity", values?.aboutUniversity);
      formData.append("email", values?.email);
      formData.append("phoneNo", values?.phoneNo);
      formData.append("address", values?.address);

      courses?.forEach((course, index) => {
        formData?.append(`courses[${index}]`, course);
      });

      tags?.forEach((tag, index) => {
        formData?.append(`tags[${index}]`, tag);
      });

      hosts.forEach((host, index) => {
        formData.append(`host[${index}]`, host._id);
      });

      if (profileImage.file) {
        formData.append("profile_image", profileImage.file);
      }

      if (bgImage.file) {
        formData.append("banner_image", bgImage.file);
      }

      try {
        let response;
        if (id) {
          response = await editUniversity(id, formData);
        } else {
          response = await createUniversity(formData);
        }
        if (response) {
          CustomToast({
            type: "success",
            message: "University created successfully",
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
        if (!searchQuery) {
          setUser((prevUsers) => [...prevUsers, ...response?.data]);
          setTotalUsers(response?.pagination.totalCount);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchUniversity = async () => {
        setLoader(true);
        try {
          const response = await getUniversityById(id);
          if (response) {
            const university = response?.data;
            formik.setValues({
              universityName: university?.universityName || "",
              websiteURL: university?.websiteURL || "",
              aboutUniversity: university?.aboutUniversity || "",
              universityAbbreviation: university?.universityAbbreviation || "",
              universityDomain: university?.universityDomain || "",
              email: university?.email || "",
              phoneNo: university?.phoneNo || "",
              address: university?.address || "",
              profile_image: university?.profile_image,
              banner_image: university?.banner_image,
              courses: university?.courses || [],
              tags: university?.tags || [],
            });
            setCourses(university?.courses || []);
            setHosts(university?.hosts || []);
            setTags(university?.tags || []);
            setBgImage({
              file: null,
              imageUrl: university?.banner_image || "",
            });
            setProfileImage({
              file: null,
              imageUrl: university?.profile_image || "",
            });
          }
          handlegetUserData(limit, page);
        } catch (error) {
        } finally {
          setLoader(false);
        }
      };
      fetchUniversity();
    }
  }, [id, limit, page]);

  const handleSearchUser = async (query, page, limit) => {
    setLoader(true);
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

  const handleAddItem = (value, setValue, items, setItems, name) => {
    // Will remove the extra spaces from the words

    const trimmedString = value.replace(/\s+/g, " ")?.trim();

    if (trimmedString) {
      if (!items?.find((tag) => tag === trimmedString))
        setItems([...items, trimmedString]);
      setValue("");
      formik?.setFieldValue(name, [...items, trimmedString]);
    }
  };

  const handleKeyDown = (e, value, setValue, items, setItems, name) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem(value, setValue, items, setItems, name);
    }
  };

  const handleRemoveItem = (index, items, setItems, name) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    formik?.setFieldValue(name, newItems);
  };

  const handleUpload = (event, setterFn, name) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setterFn({ file, imageUrl });
      formik?.setFieldValue(name, file);
    }
  };

  const handleAddHost = (host) => {
    if (host && !hosts.some((h) => h?._id === host?._id)) {
      setHosts([...hosts, host]);
    }
  };

  const lastUserElementRef = useCallback(
    (node) => {
      if (loader) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && user.length < totalUsers) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loader, user.length, totalUsers]
  );

  //loading
  if (loader && !user.length) {
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
              blinkBreadCrumText="Universities"
              blinkBreadCrumText1={id ? "Edit University" : "Add University"}
              handleSearchChange={() => console.log("hello")}
              searchShow={false}
            />
          </div>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="px-2">
          <ImageUpload
            bgImage={bgImage}
            handleUpload={handleUpload}
            setBgImage={setBgImage}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            uploadProfile={true}
            isphotoView={!id}
          />

          <div
            className="mt-2"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span className="error-message">
              {formik.errors.profile_image || null}
            </span>

            <span className="error-message">
              {formik.errors.banner_image || null}
            </span>
          </div>

          <UniversityForm formik={formik} isView={!id} />
          <div className="course-section">
            <p className="course-heading">Add Course</p>
            <TagInput
              name="courses"
              tags={courses}
              setTags={setCourses}
              handleRemoveItem={handleRemoveItem}
              tagInputValue={inputValue}
              setTagInputValue={setInputValue}
              handleKeyDown={handleKeyDown}
              handleAddItem={handleAddItem}
              placeholder="Add Course"
              isView={!id}
            />
            {!id && (
              <Suggestion
                title={"Suggested Courses:"}
                data={suggestionsData}
                handleAddItem={(value) =>
                  handleAddItem(
                    value,
                    setInputValue,
                    courses,
                    setCourses,
                    "courses"
                  )
                }
              />

            )

            }


            <span className="error-message">
              {formik.errors.courses ? "Course is required" : null}
            </span>

          </div>

          <div className="course-section">
            <p className="course-heading">Add Tags</p>
            <TagInput
              name="tags"
              tags={tags}
              setTags={setTags}
              handleRemoveItem={handleRemoveItem}
              tagInputValue={tagInputValue}
              setTagInputValue={setTagInputValue}
              handleKeyDown={handleKeyDown}
              handleAddItem={handleAddItem}
              placeholder="Add Tags"
              isView={!id}
            />
            {!id && (
              <Suggestion
                title={"Suggested Tags:"}
                data={suggestionsData}
                handleAddItem={(value) =>
                  handleAddItem(value, setTagInputValue, tags, setTags, "tags")
                }
              />

            )}

            <span className="error-message">
              {formik.errors.tags ? "Tag is required" : null}
            </span>
          </div>

          {/* {id && (
            <div className="course-section hosts">
              <p className="course-heading">Add Host</p>
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
          )} */}

          <CouseSection formik={formik} isView={!id} />
          {id == undefined && (
            <div>
              <CustomButton
                text={isLoading ? <ButtonLoader /> : "Add"}
                backgroundColor={"#0D0D0D"}
                textColor={"white"}
                padding={"5px 1.5rem"}
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

export default EditUniversity;
