import axios from 'axios';
import { toast } from 'react-toastify';

// Action Types
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAIL = 'UPDATE_PROFILE_FAIL';

// Update Profile Action
export const updateProfile = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios.put('/api/admin/profile', formData, config);

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update profile';
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: message,
    });
    throw new Error(message);
  }
}; 