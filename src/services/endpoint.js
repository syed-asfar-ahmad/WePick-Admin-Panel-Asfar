export const USER_LOGIN = "admin/login";
export const GET_UNIVERSITY = "university";
export const GET_UNIVERSITY_BY_ID = "university";
export const GET_ALL_POSTS = "user/posts";
export const GET_USERS_POSTS = "user/post/own";
export const GET_TIME_FOR_POSTS = "user/timeposts?timeframe=month";
export const GET_POST_BY_ID = "user/post";
export const SEARCH_POSTS = "user/search/posts";
export const SEARCH_COMMUNITY = "search/community";
export const GET_USER_EVENT = "user/event";
export const EDIT_UNIVERSITY = "university/update";
export const DELETE_UNIVERSITY = "university/delete";
export const DELETE_EVENT = "/delete/Event";
export const DELTE_EVENT_HOST = "/user/removeEventHost";
export const EDIT_EVENT = "update/Event";
export const DELETE_POST = "/user/delete";
export const GET_STORIES = "/user/stories";
//export const GET_STORIES="/admin/stories"
export const ALL_COMMUNITIES = "/allcommunities";
export const OFFICIAL_COMMUNITY = "/getOfficialCommunity";
export const CUSTOM_COMMUNITY = "/allcommunities?isAnonymous=false";
export const WITHDRAWAL_REQUESTS = "/getadminrequests";
export const GET_USER = "/user/all";
export const USER_CHANGE_STATUS = "user/status";
export const BOOSTED_POST = "user/boost/posts";
export const BOOSTED_EVENT = "/boost/event";
export const BOOSTED_STORIES = "/admin/boost/stories";
export const DELETE_STORY = "/delete/story";
export const DELETE_COMMUNITY = "/delete";
export const EDIT_COMMUNITY = "update";

//Search User
export const SEACRH_USER = "/user/adminSearch";
export const SEACRH_STORIES = "/searchGroup";

//Get User detail
// export const GET_USER_PROFILE = "user/detail";
export const GET_USER_PROFILE = "user/getUserAndQuestion";
//Edit User
export const UPDATE_USER_PROFILE = "user/updateUserProfile";
//delete Question
export const DELETE_QUESTION = "/question";
export const DELETE_COMMENTS = "/post/comment/delete";
//get comments
export const GET_COMMENTS = "post/Comment";
//User Likes
export const USER_LIKES = "likesCount";
//Moderations
export const MODERATIONS_POSTS = "getpostreports";
export const MODERATIONS_USERS = "getuserreports";
export const MODERATIONS_STORIES = "getstoryreports";
export const MODERATIONS_QUESTIONS = "getquestionreports";
export const MODERATIONS_COMMENTS = "getcommentreports";
export const MODERATIONS_COMMUNITTIES = "getcommunityreports";
export const MODERATIONS_EVENTS = "geteventreports";
export const MODERATIONS_POSTS_DELETE = "deletepostreport";
export const MODERATIONS_STORIES_DELETE = "deletestoryreport";
export const MODERATIONS_QUESTION_DELETE = "deletequestionreport";
export const MODERATIONS_COMMENT_DELETE = "deletecommentreport";
export const MODERATIONS_EVENT_DELETE = "deleteeventreport";
export const MODERATIONS_USER_DELETE = "deleteuserreport";
export const MODERATIONS_COMMUNITY_DELETE = "deletecommunityreport";
export const MODERATIONS_REPORT_DETAILS = "getreportdetails";
export const STATS_REPORT = "getreportcount";
export const ACCOUNT_APPROVAL = "approve";
export const DASH_COUNT = "dashcount";
export const DASH_COMMUNITY = "commdash";
export const GET_USER_POSTS = "user/post/own";
export const GET_USER_FRIENDS = "getuserfriends";

//Get Boost
export const GET_BOOSTS = "getboost";

// Withdrawal Requests

export const UPLOAD_WITHDRAWAL_REQUEST_RECEIPT = '/updatestatus';

// Posts

export const GET_POST_LIKES = '/likes';
export const GET_POST_TAGGED_PEOPLE = '/user/post/tagged-people';

//
// export const GET_ALL_QUESTIONS = "";
// export const GET_ALL_COMMUNITIES = "";
// export const GET_ALL_COMMENTS = "";

// export const SEARCH_QUESTIONS = "/moderations/questions";
// export const SEARCH_COMMUNITIES = "/moderations/communities";
// export const SEARCH_COMMENTS = "/moderations/comments";
