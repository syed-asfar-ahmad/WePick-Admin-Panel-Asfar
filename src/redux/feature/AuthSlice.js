import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CustomToast } from "../../atoms/toastMessage";

// Static credentials for testing
const STATIC_CREDENTIALS = {
  email: "admin@example.com",
  password: "admin123"
};

// Static user data
const STATIC_USER = {
  id: 1,
  email: "admin@example.com",
  role: "admin",
  name: "Admin User"
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check against static credentials
      if (credentials.email === STATIC_CREDENTIALS.email && 
          credentials.password === STATIC_CREDENTIALS.password) {
        CustomToast({
          type: "success",
          message: `${STATIC_USER.role} is signed in`,
        });
        return {
          user: STATIC_USER,
          isAuthenticated: true
        };
      } else {
        throw new Error("Invalid Email or Password");
      }
    } catch (error) {
      CustomToast({ type: "error", message: "Invalid Email or Password" });
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false
  },
  reducers: {
    clearAuthentication: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthentication } = authSlice.actions;

export default authSlice.reducer;
