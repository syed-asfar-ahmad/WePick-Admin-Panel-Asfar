import { useState } from 'react';
import axios from 'axios';
import { CustomToast } from '../atoms/toastMessage';

const  useDeleteData = () => {
    const BaseURL = process.env.REACT_APP_BASE_URL;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // const token = "127|juaOCZEl1fB0270M5PnwASGgkiPZ18ysci19JXGj"
    const token = localStorage.getItem("token");
    const deleteData = async (url, cb) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        setIsLoading(true);
        try {
            const response = await axios.get(`${BaseURL}/${url}`, config);
            if (response.data?.success === true) {
                cb(response.data)
            }
            else {
                // CustomToast({
                //     type: "error",
                //     message: `${response?.data?.response}`,
                // });
            }
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, deleteData };
};

export default useDeleteData;
