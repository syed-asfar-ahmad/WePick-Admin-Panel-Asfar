import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { accountApproval, getAccountApproval } from "../../services/service";
import ButtonLoader from "../../atoms/buttonLoader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const DownArrowSvg = (
  <svg
    width="16"
    height="8"
    viewBox="0 0 16 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 0.999998L9.23737 6.5118C8.55682 7.16273 7.44318 7.16273 6.76263 6.5118L1 0.999998"
      stroke="#0D0D0D"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const createOptions = (start, end, suffix) => {
  const options = [];
  for (let i = start; i <= end; i++) {
    options.push(
      <Option key={i} value={`${i} ${suffix}`}>
        {i} {suffix}
      </Option>
    );
  }
  return options;
};

const timeOptions = createOptions(1, 120, "min");
const rateOptions = createOptions(1, 100, "%");

const validationSchema = Yup.object()
  .shape({
    minApprovalTime: Yup.string().required("Minimum approval time is required"),
    maxApprovalTime: Yup.string().required("Maximum approval time is required"),
    approvalRate: Yup.string().required("Approval rate is required"),
  })
  .test(
    "time-validation",
    "Maximum approval time should be greater than minimum approval time",
    function (values) {
      const { minApprovalTime, maxApprovalTime } = values;
      if (!minApprovalTime || !maxApprovalTime) return true;

      const minTime = parseInt(minApprovalTime.split(" ")[0]);
      const maxTime = parseInt(maxApprovalTime.split(" ")[0]);

      if (minTime >= maxTime) {
        return this.createError({
          path: "maxApprovalTime",
          message:
            "Maximum approval time should be greater than minimum approval time",
        });
      }

      return true;
    }
  );

const AccountApproval = () => {
  const [initialValues, setInitialValues] = useState({
    minApprovalTime: "",
    maxApprovalTime: "",
    approvalRate: "",
  });
  const [isButtonClickable, setIsButtonClickable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountApproval = async () => {
      try {
        const response = await getAccountApproval();
        if (response) {
          const approvalData = response?.data;
          setInitialValues({
            minApprovalTime: `${approvalData.minApprovalTime} min`,
            maxApprovalTime: `${approvalData.maxApprovalTime} min`,
            approvalRate: `${approvalData.approvalRate} %`,
          });
        }
      } catch (error) {
        toast.error("Failed to fetch account approval data.");
      }
    };

    fetchAccountApproval();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!isButtonClickable) return;

    setIsButtonClickable(false);
    const formattedValues = {
      minApprovalTime: parseInt(values.minApprovalTime.split(" ")[0]),
      maxApprovalTime: parseInt(values.maxApprovalTime.split(" ")[0]),
      approvalRate: parseInt(values.approvalRate.split(" ")[0]),
    };

    try {
      await accountApproval(formattedValues);
      toast.success("Configuration saved successfully!");
    } catch (error) {
      toast.error("Failed to save configuration.");
    } finally {
      navigate("/");
    }

    setSubmitting(false);
    setTimeout(() => setIsButtonClickable(true), 3000); // 3-second debounce
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
      }}
      className="py-4 px-2"
    >
      <ListHeader
        mainHeading="Configuration"
        linkBreadCrum="/accountapproval"
        blinkBreadCrumText="Configuration"
        blinkBreadCrumText1="Account Approval"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginTop: "60px",
        }}
      >
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <div style={{ flex: 1, marginRight: "20px" }}>
                  <label style={{ fontSize: "20px", fontWeight: "600" }}>
                    Min Approval Time
                  </label>
                  <Field name="minApprovalTime">
                    {({ field }) => (
                      <>
                        <Select
                          {...field}
                          onChange={(value) =>
                            setFieldValue("minApprovalTime", value)
                          }
                          style={{ width: "100%" }}
                        >
                          {timeOptions}
                        </Select>
                        <ErrorMessage
                          name="minApprovalTime"
                          component="div"
                          style={{ color: "red" }}
                        />
                      </>
                    )}
                  </Field>
                </div>
                <div style={{ flex: 1, marginLeft: "20px" }}>
                  <label style={{ fontSize: "20px", fontWeight: "600" }}>
                    Max Approval Time
                  </label>
                  <Field name="maxApprovalTime">
                    {({ field }) => (
                      <>
                        <Select
                          {...field}
                          onChange={(value) =>
                            setFieldValue("maxApprovalTime", value)
                          }
                          style={{ width: "100%" }}
                        >
                          {timeOptions}
                        </Select>
                        <ErrorMessage
                          name="maxApprovalTime"
                          component="div"
                          style={{ color: "red" }}
                        />
                      </>
                    )}
                  </Field>
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "20px", fontWeight: "600" }}>
                  Approval Rate
                </label>
                <Field name="approvalRate">
                  {({ field }) => (
                    <>
                      <Select
                        {...field}
                        onChange={(value) =>
                          setFieldValue("approvalRate", value)
                        }
                        style={{ width: "100%" }}
                      >
                        {rateOptions}
                      </Select>
                      <ErrorMessage
                        name="approvalRate"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </>
                  )}
                </Field>
              </div>
              <button
                type="submit"
                // disabled={isSubmitting}
                style={{
                  marginTop: "20px",
                  width: "20%",
                  height: "40px",
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "20px",
                }}
              >
                {isSubmitting ? <ButtonLoader /> : "Done"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AccountApproval;
