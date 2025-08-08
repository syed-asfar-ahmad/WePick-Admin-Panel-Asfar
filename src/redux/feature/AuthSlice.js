import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CustomToast } from "../../atoms/toastMessage";
import axios from "axios";
import { BASE_URL } from "../../config/api";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, credentials);

      // Fix: Use accessToken instead of token
      const { user, accessToken } = response.data;

      CustomToast({
        type: "success",
        message: `${user?.role || "Admin"} is signed in`,
      });

      // Store token locally (optional)
      localStorage.setItem("authToken", accessToken);

      return {
        user,
        token: accessToken, // Use accessToken as token
        isAuthenticated: true,
      };
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Invalid Email or Password";
      CustomToast({ type: "error", message: errMsg });
      return rejectWithValue(errMsg);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false
  },
  reducers: {
    clearAuthentication: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authToken");
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});


export const { clearAuthentication, updateUserProfile } = authSlice.actions;

export default authSlice.reducer;
