import React from "react";
import "../../assets/css/comment.scss";
import { DeleteIcon } from "../../assets/icons";
import { CMSvg, notLikedSvg } from "../../assets/icons";

const Comment = ({
  name,
  data,
  handleDeletePostComment
}) => {

  const { username, universityName, profileImage, replyTo, universityAbbreviation, content, likeCounter, repliesCounter, time } = data;

  return (
      <div className="comment px-0 py-3" style={{ display: 'flex', flexDirection: 'row'}}>
        <div className="comment__header pt-1">
          <img src={profileImage ? profileImage : "https://via.placeholder.com/150"}
            alt="User profile"
            className="profile-pic"
          />
        </div>

        {name === 'Comments' ?

          <div className="px-3" style={{ flex: '1'}}>
            <p className="comment_username">{username} <span> · {universityAbbreviation} {time}</span></p>
            <p className="comment_reply">Replying to <span>@{replyTo}</span></p>
            <p className="comment_content mb-0">{content}</p>
            <div>
              <span className="comment_content">{notLikedSvg(null, '16.15','14')} {likeCounter}</span>
              <span className="comment_content ml-1">{CMSvg(null, '15.17', '14')} {repliesCounter}</span>
            </div>
          </div>
        
          :
          
          <div className="px-3 pt-2" style={{flex: '1'}}>
            <p className="comment_username">{username}</p>
            <p className="comment_reply">Posted on {universityName}</p>
          </div>
        }
        
        {name === 'Comments' && <div className="comment__delete-btn d-flex align-items-center cursor-pointer" onClick={() => handleDeletePostComment(data?.id)}>{DeleteIcon}</div>}

      </div>
  );
};

export default Comment;
