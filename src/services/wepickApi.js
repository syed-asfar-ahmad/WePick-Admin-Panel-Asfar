import { postRequest, getRequest, patchRequest, patchRequestForm } from './api';

// Auth endpoints
export const SIGNUP = 'auth/signup';
export const SIGNIN = 'auth/signin';
export const SIGNOUT = 'auth/signout';
export const FORGOT_PASSWORD = 'auth/forgot-password';
export const VERIFY_OTP = 'auth/verify-otp';
export const RESET_PASSWORD = 'auth/reset-password';

// User endpoints
export const UPDATE_PROFILE = 'user/update-profile';
export const UPDATE_PASSWORD = 'user/update-password';
export const GET_USER_PROFILE = 'user/profile';

// Parcel endpoints
export const TRACK_PARCEL = 'parcel/track';
export const DISPATCH_PARCEL = 'parcel/dispatch';
export const GET_PARCEL_SUMMARY = 'parcel/summary';
export const GET_PARCEL_REPORT = 'parcel';
export const GET_PARCEL_DETAIL = 'parcel';

// Auth services
export const signup = (data) => postRequest(SIGNUP, data);
export const signin = (data) => postRequest(SIGNIN, data);
export const signout = (data) => postRequest(SIGNOUT, data);
export const forgotPassword = (data) => postRequest(FORGOT_PASSWORD, data);
export const verifyOtp = (data) => postRequest(VERIFY_OTP, data);
export const resetPassword = (data) => postRequest(RESET_PASSWORD, data);

// User services
export const updateProfile = (data) => patchRequestForm(UPDATE_PROFILE, data);
export const updatePassword = (data) => patchRequest(UPDATE_PASSWORD, data);
export const getUserProfile = () => getRequest(GET_USER_PROFILE);

// Parcel services
export const trackParcel = (trackingId) => getRequest(`${TRACK_PARCEL}/${trackingId}`);
export const dispatchParcel = (data) => postRequest(DISPATCH_PARCEL, data);
export const getParcelSummary = (startDate, endDate) => 
  getRequest(GET_PARCEL_SUMMARY, { start: startDate, end: endDate });
export const getParcelReport = (startDate, endDate) => 
  getRequest(GET_PARCEL_REPORT, { start: startDate, end: endDate });
export const getParcelDetail = (parcelId) => getRequest(`${GET_PARCEL_DETAIL}/${parcelId}`); 