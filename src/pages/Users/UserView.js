import React, { useEffect, useState } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import QuestionCard from "./QuestionCard";
import CustomButton from "../../atoms/CustomButton/CustomButton";
import ConfirmationModal from "../../atoms/ConfirmationModal";
import {
  deleteQuestion,
  getUserProfile,
  updateUserProfile,
} from "../../services/service";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useFormik, FormikProvider, useFormikContext } from "formik";
import * as Yup from "yup";
import { CustomToast } from "../../atoms/toastMessage";
import NoDataFound from "../../atoms/NodataFound";
import "./user.scss";
import PageLoader from "../../components/common/PageLoader";

const UserViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [confimationLoading, setConfimationLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      Name: "",
      userName: "",
      email: "",
      universityName: "",
      universityId: "",
      bio: "",
    },
    validationSchema: Yup.object({
      Name: Yup.string().required("Name is required"),
      userName: Yup.string().required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      universityName: Yup.string().required("University name is required"),
      bio: Yup.string().required("Bio is required"),
    }),
    onSubmit: async (values) => {
      const data = {
        Name: values?.Name,
        email: values?.email,
        userName: values?.userName,
        universityName: values?.universityName,
        university: values?.universityId,
        bio: values?.bio,
        id: values?._id,
      };
      setButtonLoading(true);
      try {
        const response = await updateUserProfile(data);
        if (response) {
          CustomToast({
            type: "success",
            message: `User updated successfully`,
          });
        }
        navigate(-1); // Navigate back
      } catch (error) {
        console.error("Error updating status", error);
        CustomToast({
          type: "error",
          message: `Error updating status`,
        });
      } finally {
        setButtonLoading(false);
      }
    },
  });

  const handleGetUserProfile = async () => {
    setLoader(true);
    try {
      const response = await getUserProfile(id);
      if (response) {
        const userData = response?.data?.user[0] || [];
        const questions = response?.data?.questions;
        formik.setValues({
          Name: userData?.Name || "",
          userName: userData?.userName || "",
          email: userData?.email || "",
          universityName: userData?.university?.universityName || "",
          universityId: userData?.university?._id || "",
          bio: userData?.bio || "",
          _id: userData?._id || "",
        });
        setQuestions(questions);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    setConfimationLoading(true);
    try {
      const response = await deleteQuestion(questionId);
      if (response) {
        setQuestions(
          questions.filter((question) => question._id !== questionId)
        );
        CustomToast({
          type: "success",
          message: "Question deleted successfully!",
        });
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting question:", error.message);
      CustomToast({
        type: "error",
        message: "Failed to delete question. Please try again later.",
      });
    } finally {
      setConfimationLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    if (questionToDelete) {
      handleDeleteQuestion(questionToDelete);
    }
  };

  const handleDeleteClick = (questionId) => {
    setQuestionToDelete(questionId);
    setShowModal(true);
  };

  useEffect(() => {
    if (id) {
      handleGetUserProfile();
    }
  }, [id]);

  if (loader) {
    return <PageLoader />;
  }

  return (
    <>
      <div className="row px-2 mb-5 pt-4" style={{ fontFamily: "Montserrat" }}>
        <div className="col-12 pb-5">
          <ListHeader
            mainHeading="Users"
            placeholder="Search user by name, email, university or course"
            linkBreadCrum="/users"
            blinkBreadCrumText="Users"
            blinkBreadCrumText1="User Details"
            handleSearchChange={() => console.log("hello")}
            searchShow={false}
          />
        </div>
        <div className="col-12">
          <FormikProvider value={formik}>
            <div className="px-2 d-flex flex-column" style={{ gap: "1rem" }}>
              <form
                className="border rounded px-3 py-3 bg-white row flex-column"
                style={{ gap: "1rem" }}
                onSubmit={formik.handleSubmit}
              >
                <p className="user-info">User's Information</p>

                <div>
                  <Input
                    name="Name"
                    value={formik.values.Name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                  />
                  {formik.touched.Name && formik.errors.Name ? (
                    <div
                      className="mt-1"
                      style={{ color: "red", fontSize: "12px" }}
                    >
                      {formik.errors.Name}
                    </div>
                  ) : null}
                </div>

                <div
                  className="d-flex flex-column flex-md-row"
                  style={{ gap: "1rem" }}
                >
                  <div className="flex-grow-1">
                    <Input
                      className="w-100"
                      name="userName"
                      value={formik.values.userName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled
                    />
                    {formik.touched.userName && formik.errors.userName ? (
                      <div
                        className="mt-1"
                        style={{ color: "red", fontSize: "12px" }}
                      >
                        {formik.errors.userName}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex-grow-1">
                    <Input
                      className="w-100"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div
                        className="mt-1"
                        style={{ color: "red", fontSize: "12px" }}
                      >
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <Input
                    name="universityName"
                    value={formik.values.universityName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                  />
                  {formik.touched.universityName &&
                  formik.errors.universityName ? (
                    <div
                      className="mt-1"
                      style={{ color: "red", fontSize: "12px" }}
                    >
                      {formik.errors.universityName}
                    </div>
                  ) : null}
                </div>

                <div>
                  <TextArea
                    rows={4}
                    name="bio"
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                  />
                  {formik.touched.bio && formik.errors.bio ? (
                    <div
                      className="mt-1"
                      style={{ color: "red", fontSize: "12px" }}
                    >
                      {formik.errors.bio}
                    </div>
                  ) : null}
                </div>
              </form>

              {questions?.length > 0 ? (
                <div
                  className="border rounded px-3 py-3 bg-white row flex-column mb-3"
                  style={{ gap: "1rem" }}
                >
                  <h5>Questions ({questions?.length})</h5>
                  <div
                    className="d-flex flex-column overflow-auto pr-2"
                    style={{ gap: "1rem", maxHeight: "28rem" }}
                  >
                    {questions?.map((ele) => {
                      return (
                        <QuestionCard
                          id={ele._id}
                          key={ele}
                          question="Hey, Do you live in Istanbul?"
                          answer="Yes"
                          onDelete={() => handleDeleteClick(ele?._id)}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="border rounded px-3 py-3 bg-white row flex-column mb-3 text-center">
                  <p className="user-info">Questions (0)</p>
                  <NoDataFound />
                </div>
              )}
            </div>
          </FormikProvider>
        </div>

        {/* <div className="col-12 p-0 px-2">
          <CustomButton
            text={"Save"}
            backgroundColor={"#0D0D0D"}
            textColor={"white"}
            padding={"8px 7.5rem"}
            onClick={formik.handleSubmit}
            loading={buttonLoading}
          />
        </div> */}

        <ConfirmationModal
          show={showModal}
          handleClose={handleClose}
          handleConfirm={handleConfirm}
          loading={confimationLoading}
        />
      </div>
    </>
  );
};

export default UserViewPage;
