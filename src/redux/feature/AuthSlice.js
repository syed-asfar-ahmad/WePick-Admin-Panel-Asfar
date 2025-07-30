import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CustomToast } from "../../atoms/toastMessage";
import axios from "axios";

const BASE_URL = "http://51.20.35.1/api/v1/admin";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, credentials);

      const { user, token } = response.data;

      CustomToast({
        type: "success",
        message: `${user?.role || "Admin"} is signed in`,
      });

      // Store token locally (optional)
      localStorage.setItem("authToken", token);

      return {
        user,
        token,
        isAuthenticated: true,
      };
    } catch (error) {
      console.error("API Full Error:", error.response?.data);

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
