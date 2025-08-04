import { useState } from "react";
import axios from "axios";
import { CustomToast } from "../atoms/toastMessage";
import { useParams } from "react-router-dom";

const usePost = () => {
  const BaseURL = process.env.REACT_APP_BASE_URL;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const token = "127|juaOCZEl1fB0270M5PnwASGgkiPZ18ysci19JXGj";
  const token = localStorage.getItem("token");
  // console.log("tokenlll", token)
  const postData = async (url, postData, cb) => {
    setIsLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(`${BaseURL}/${url}`, postData, config);
      if (response?.status === 200) {
        cb(response?.data);
      } 
      else {
        CustomToast({
          type: "error",
          message: "Successfully Updated",
        });
      }
      setData(response.data);
    } catch (error) {
      setError(error);
      // CustomToast({
      //   type: "error",
      //   message: `${error}`,
      // });
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, postData };
};

export default usePost;
