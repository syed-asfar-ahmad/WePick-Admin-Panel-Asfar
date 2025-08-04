import { postRequest, getRequest, patchRequest, patchRequestForm, postRequestForm } from './api';

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
export const GET_PARCEL_REPORT = 'parcels';
export const GET_PARCEL_DETAIL = 'parcels';

// Dashboard endpoints
export const ADMIN_DASHBOARD = '/dashboard';

// Retailers endpoint
export const RETAILERS = '/retailers';

// Dispatched Parcels endpoints
export const DISPATCHED = '/dispatched';

// Received Parcels endpoints
export const RECEIVED_PARCELS = '/received-parcels';

// Customers endpoints
export const CUSTOMERS = '/customers';

// Notifications endpoints
export const NOTIFICATIONS = '/notifications';

// Lockers endpoints
export const LOCKERS = '/lockers';

// Parcels endpoints
export const PARCELS = '/parcels';

// Admin Auth endpoints
export const ADMIN_CHANGE_PASSWORD = 'auth/change-password';
export const ADMIN_EDIT_PROFILE = 'auth/edit-profile';

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

// Parcel services
export const trackParcel = (trackingId) => getRequest(`${TRACK_PARCEL}/${trackingId}`);
export const dispatchParcel = (data) => postRequest(DISPATCH_PARCEL, data);
export const getParcelSummary = (startDate, endDate) => 
  getRequest(GET_PARCEL_SUMMARY, { start: startDate, end: endDate });
export const getParcelReport = (startDate, endDate) => 
  getRequest(GET_PARCEL_REPORT, { start: startDate, end: endDate });
export const getParcelDetail = (parcelId) => getRequest(`${GET_PARCEL_DETAIL}/${parcelId}`); 

// Admin Services
export const getAdminDashboard = (page = 1) => getRequest(`${ADMIN_DASHBOARD}?page=${page}`);

// Retailer services
export const getRetailers = (page = 1) => getRequest(`${RETAILERS}?page=${page}`);
export const getRetailerById = (id) => getRequest(`/retailers/${id}`);
export const updateRetailerById = (id, data) => patchRequest(`/retailers/${id}`, data);

// Dispatched Parcels services
export const getDispatchedParcels = (page = 1) => getRequest(`${DISPATCHED}?page=${page}`);
export const getDispatchedParcelById = (id) => getRequest(`${DISPATCHED}/${id}`);
export const updateDispatchedParcelById = (id, data) => patchRequest(`${DISPATCHED}/${id}`, data);

// Received Parcels services
export const getReceivedParcels = (page = 1) => getRequest(`${RECEIVED_PARCELS}?page=${page}`);
export const getReceivedParcelById = (id) => getRequest(`${RECEIVED_PARCELS}/${id}`);
export const updateReceivedParcelById = (id, data) => patchRequest(`${RECEIVED_PARCELS}/${id}`, data);

// Customers services
export const getCustomers = (page = 1) => getRequest(`${CUSTOMERS}?page=${page}`);
export const getCustomerById = (id) => getRequest(`${CUSTOMERS}/${id}`);
export const updateCustomerById = (id, data) => patchRequest(`/customers/${id}`, data);

// Notifications services
export const getNotifications = (page = 1) => getRequest(`${NOTIFICATIONS}?page=${page}`);
export const getNotificationById = (id) => getRequest(`${NOTIFICATIONS}/${id}`);

// Lockers services
export const getLockers = () => getRequest(LOCKERS);

// Parcels services
export const getParcels = (page = 1) => getRequest(`${PARCELS}?page=${page}`);
export const updateParcel = (id, data) => patchRequest(`${PARCELS}/${id}`, data);

// Admin Auth services
export const adminChangePassword = (data) => postRequest(ADMIN_CHANGE_PASSWORD, data);
export const adminEditProfile = (data) => patchRequestForm(ADMIN_EDIT_PROFILE, data);


