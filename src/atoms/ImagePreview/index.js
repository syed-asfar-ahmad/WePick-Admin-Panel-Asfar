import React from "react";
import { Modal } from "antd";
import "./ImagePreview.scss";
import crossIcon from "../../assets/images/Frame 48.png";

const ImagePreview = ({
  imagePreviewUrl,
  videoUrl,
  description,
  closeImagePreview,
  isPreviewOpen,
  userProfile,
  userName,
  storyTime,
}) => {
  const hasMedia = videoUrl || imagePreviewUrl;

  return (
    <Modal
      visible={isPreviewOpen}
      onCancel={closeImagePreview}
      footer={null}
      centered
      closeIcon={
        <img
          src={crossIcon}
          alt="Close Icon"
          style={{ width: "25px", height: "25px" }}
        />
      }
      className="modal-container"
    >
      <div className={`main_div ${!hasMedia ? "no-media" : ""}`}>
        <div className={`img_profile ${!hasMedia ? "no-media" : ""}`}>
          <img
            src={userProfile}
            alt="userProfile"
            className="user_profile_img"
          />
          <p className="user_name">{userName}</p>
          <p className="story_time">{storyTime}</p>
        </div>
        {videoUrl ? (
          <video className="media_div" src={videoUrl} controls />
        ) : imagePreviewUrl ? (
          <img className="media_div" src={imagePreviewUrl} alt="imagePreview" />
        ) : (
          <p className="description_div no-media">{description}</p>
        )}
        {hasMedia && <p className="description_div">{description}</p>}
      </div>
    </Modal>
  );
};

export default ImagePreview;
