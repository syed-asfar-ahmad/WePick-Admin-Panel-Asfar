import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
  postRequestForm,
  patchRequestForm,
} from "./api";
import {
  GET_UNIVERSITY,
  USER_LOGIN,
  GET_ALL_POSTS,
  GET_TIME_FOR_POSTS,
  GET_POST_BY_ID,
  EDIT_UNIVERSITY,
  GET_USER_EVENT,
  DELETE_EVENT,
  DELETE_POST,
  GET_STORIES,
  OFFICIAL_COMMUNITY,
  GET_USER,
  BOOSTED_POST,
  BOOSTED_EVENT,
  BOOSTED_STORIES,
  CUSTOM_COMMUNITY,
  DELETE_STORY,
  DELETE_COMMUNITY,
  USER_CHANGE_STATUS,
  SEACRH_USER,
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
  DELETE_QUESTION,
  GET_COMMENTS,
  USER_LIKES,
  DELETE_UNIVERSITY,
  GET_UNIVERSITY_BY_ID,
  SEARCH_POSTS,
  DELTE_EVENT_HOST,
  EDIT_EVENT,
  SEACRH_STORIES,
  EDIT_COMMUNITY,
  SEARCH_COMMUNITY,
  GET_BOOSTS,
  MODERATIONS_POSTS,
  MODERATIONS_USERS,
  MODERATIONS_STORIES,
  MODERATIONS_QUESTIONS,
  MODERATIONS_COMMENTS,
  MODERATIONS_COMMUNITTIES,
  MODERATIONS_EVENTS,
  DELETE_COMMENTS,
  MODERATIONS_POSTS_DELETE,
  MODERATIONS_STORIES_DELETE,
  MODERATIONS_QUESTION_DELETE,
  MODERATIONS_COMMENT_DELETE,
  MODERATIONS_EVENT_DELETE,
  MODERATIONS_USER_DELETE,
  MODERATIONS_COMMUNITY_DELETE,
  MODERATIONS_REPORT_DETAILS,
  STATS_REPORT,
  ACCOUNT_APPROVAL,
  DASH_COUNT,
  DASH_COMMUNITY,
  GET_USERS_POSTS,
  GET_USER_FRIENDS,
  ALL_COMMUNITIES,
  WITHDRAWAL_REQUESTS,
} from "./endpoint";

export const loginWithEmail = (data) => postRequest(USER_LOGIN, data);
export const createUniversity = (data) =>
  postRequestForm(`${GET_UNIVERSITY}`, data);
export const editUniversity = (id, data) =>
  patchRequestForm(`${EDIT_UNIVERSITY}/${id}`, data);
export const getUniversityData = (page, limit, query) =>
  getRequest(`${GET_UNIVERSITY}/?limit=${limit}&page=${page}&query=${query}`);

export const getUniversityById = (id) =>
  getRequest(`${GET_UNIVERSITY_BY_ID}/${id}`);
export const deleteUniversity = (data) =>
  patchRequest(`${DELETE_UNIVERSITY}/${data?.id}`);

export const getPostData = (limit, page, data) =>
  getRequest(`${GET_ALL_POSTS}/?&limit=${limit}&page=${page}`, data);
export const getUsersPosts = (url, data) => getRequest(url, data);
export const seacrhPosts = (query, page, limit) =>
  getRequest(`${SEARCH_POSTS}/?query=${query}&page=${page}&limit=${limit}`);
export const getPostTimeData = (data) => getRequest(`${GET_TIME_FOR_POSTS}`);
export const getPostById = (data) =>
  getRequest(`${GET_POST_BY_ID}/${data?.id}`);
export const getUserEvent = (limit, page, search) =>
  getRequest(`${GET_USER_EVENT}/?limit=${limit}&page=${page}&search=${search}`);
export const deleteEvent = (data) =>
  deleteRequest(`${DELETE_EVENT}/${data?.id}`);
export const editEvent = (id, data) =>
  postRequestForm(`${EDIT_EVENT}/${id}`, data);
export const deleteEventHost = (data) =>
  postRequest(`${DELTE_EVENT_HOST}`, data);
export const getEventById = (data) => getRequest(`Event/${data?.id}`);
export const deletePost = (data) => deleteRequest(`${DELETE_POST}/${data?.id}`);
export const getStories = (data) => getRequest(`${GET_STORIES}`);
export const getCommunity = (limit, page) =>
  getRequest(`${ALL_COMMUNITIES}/?limit=${limit}&page=${page}`);
export const getOfficialCommunity = (limit, page) =>
  getRequest(`${OFFICIAL_COMMUNITY}/?limit=${limit}&page=${page}`);
export const getCustomCommunity = (limit, page) =>
  getRequest(`${CUSTOM_COMMUNITY}/?limit=${limit}&page=${page}`);
export const getCommunityById = (data) => getRequest(`community/${data?.id}`);
export const editCommunity = (id, data) =>
  patchRequestForm(`${EDIT_COMMUNITY}/${id}`, data);
export const searchCommunity = (community, page, limit) =>
  getRequest(
    `${SEARCH_COMMUNITY}/?community=${community}&page=${page}&limit=${limit}`
  );

export const getModerationPosts = (limit, page, query) =>
  getRequest(
    `${MODERATIONS_POSTS}/?limit=${limit}&page=${page}&query=${query}`
  );
export const deleteModerationPost = (data) =>
  deleteRequest(`${MODERATIONS_POSTS_DELETE}/${data?.id}`);

export const getModerationUsers = (limit, page, query) =>
  getRequest(
    `${MODERATIONS_USERS}/?limit=${limit}&page=${page}&query=${query}`
  );
export const deleteModerationUser = (data) =>
  deleteRequest(`${MODERATIONS_USER_DELETE}/${data?.id}`);
export const getModerationStories = (limit, page, query) =>
  getRequest(
    `${MODERATIONS_STORIES}/?limit=${limit}&page=${page}&query=${query}`
  );

export const deleteModerationStories = (data) =>
  deleteRequest(`${MODERATIONS_STORIES_DELETE}/${data?.id}`);
export const getModerationQuestions = (limit, page, query) =>
  getRequest(
    `${MODERATIONS_QUESTIONS}/?limit=${limit}&page=${page}&query=${query}`
  );
export const deleteModerationQuestion = (data) =>
  deleteRequest(`${MODERATIONS_QUESTION_DELETE}/${data?.id}`);
export const getModerationComments = (limit, page, query) =>
  getRequest(
    `${MODERATIONS_COMMENTS}/?limit=${limit}&page=${page}&query=${query}`
  );
export const deleteModerationComment = (data) =>
  deleteRequest(`${MODERATIONS_COMMENT_DELETE}/${data?.id}`);
export const getModerationCommunities = (limit, page, query) =>
  getRequest(
    `${MODERATIONS_COMMUNITTIES}/?limit=${limit}&page=${page}&query=${query}`
  );
export const deleteModerationCommunity = (data) =>
  deleteRequest(`${MODERATIONS_COMMUNITY_DELETE}/${data?.id}`);
export const getModerationEvents = (limit, page, query) =>
  getRequest(
    `${MODERATIONS_EVENTS}/?limit=${limit}&page=${page}&query=${query}`
  );
export const deleteModerationEvent = (data) =>
  deleteRequest(`${MODERATIONS_EVENT_DELETE}/${data?.id}`);
export const getUser = (page, limit) =>
  getRequest(`${GET_USER}/?&page=${page}&limit=${limit}`);
export const boostedPost = (data) => getRequest(`${BOOSTED_POST}`);
export const boostedEvent = (data) => getRequest(`${BOOSTED_EVENT}`);
export const boostedStory = (data) => getRequest(`${BOOSTED_STORIES}`);
export const getWithdrawalRequests = (page, rowsPerPage, searchBy) =>
  getRequest(
    `${WITHDRAWAL_REQUESTS}?page=${page}&limit=${rowsPerPage}&query=${searchBy}`
  );
export const deleteBPost = (data) =>
  deleteRequest(`${DELETE_POST}/${data?.id}`);
export const deleteBEvent = (data) =>
  deleteRequest(`${DELETE_EVENT}/${data?.id}`);
export const deleteStory = (data) =>
  deleteRequest(`${DELETE_STORY}/${data?.id}`);
export const deleteCommunity = (data) =>
  deleteRequest(`${DELETE_COMMUNITY}/${data?.id}`);

//USer module
export const userChangeStatus = (id) =>
  patchRequest(`${USER_CHANGE_STATUS}/${id}`);

export const seacrhUser = (query, page, limit, isSelection = false) => {
  if (isSelection) {
    return getRequest(`${SEACRH_USER}/?search=${query}&page=${page}&limit=${limit}`);
  }
  return getRequest(`${SEACRH_USER}/?query=${query}&page=${page}&limit=${limit}`);
};
export const getUserProfile = (id) => getRequest(`${GET_USER_PROFILE}/${id}`);
export const updateUserProfile = (data) =>
  patchRequest(`${UPDATE_USER_PROFILE}`, data);
export const deleteQuestion = (data) =>
  deleteRequest(`${DELETE_QUESTION}/${data?.id}`);
export const deleteComment = (data) =>
  deleteRequest(`${DELETE_COMMENTS}/${data?.id}`);
export const getComments = (id) => getRequest(`${GET_COMMENTS}/${id}`);
export const userLikes = (id, duration) =>
  getRequest(`${USER_LIKES}/${id}?duration=${duration}`);
export const seacrhStories = (query, page, limit) =>
  getRequest(`${SEACRH_STORIES}/?query=${query}&page=${page}&limit=${limit}`);
export const getBoosts = (type, page, limit, query) =>
  getRequest(
    `${GET_BOOSTS}?type=${type}&page=${page}&limit=${limit}&query=${query}`
  );
export const getReportDetails = (id, type) =>
  getRequest(
    `${MODERATIONS_REPORT_DETAILS}/?entityId=${id}&entityType=${type}`
  );
export const getReportStats = () => getRequest(`${STATS_REPORT}`);
export const accountApproval = (data) =>
  postRequest(`${ACCOUNT_APPROVAL}`, data);
export const getAccountApproval = () => getRequest(`${ACCOUNT_APPROVAL}`);
export const getDashCount = () => getRequest(`${DASH_COUNT}`);
export const getDashCommunity = () => getRequest(`${DASH_COMMUNITY}`);
export const getUserPosts = (id, page, limit) =>
  getRequest(`${GET_USERS_POSTS}/${id}?page=${page}&limit=${limit}`);
export const getFriends = (id) => getRequest(`${GET_USER_FRIENDS}/${id}`);

// export const getContestants=(data)=>getRequest(`${GET_CONTESTANTS}/${data}`);
// export const getRandomUser=(data)=>getRequest(`${GET_RANDOM_USER}/${data}`);
// export const getContestPlayers=(data)=>getRequest(`${GET_CONTEST_PLAYERS}/${data}`);
// export const getLanguage=(data)=>getRequest(GET_LANGUAGE, data);
// export const getJsonFile=(data)=>getRequest(data);
// export const startContest=(user1,user2,params)=>getRequest(`${START_CONTEST}/${user1}/${user2}}`,params);
// export const startRoom=(data)=>getRequest(`${START_ROOM}/${data}`);
// export const deleteUser=(data,params)=>getRequest(`${DELETE_USER}/${data}`,params);
// export const gameWinDetail=(params)=>getRequest(GAME_WIN_DETAIL,params);
