import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Modal, Slider, Button } from "antd";
import gallery from "../../assets/images/university/gallery.svg";
import camera from "../../assets/images/university/camera.svg";
import dummy from "../../assets/images/university/dummy-profile.svg";
import "./university.scss";

const ImageUpload = ({
  bgImage,
  handleUpload,
  setBgImage,
  profileImage,
  setProfileImage,
  uploadProfile,
  isphotoView,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageType, setCurrentImageType] = useState(null);
  const [currentSetter, setCurrentSetter] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const processFile = (e, setter, imageType) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setCurrentImage(reader.result);
        setCurrentSetter(() => setter);
        setCurrentImageType(imageType);
        setShowCropModal(true);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCropConfirm = () => {
    if (!croppedAreaPixels || !currentImage) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = currentImage;

    image.onload = () => {
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });

        const fakeEvent = {
          target: {
            files: [file],
          },
        };

        handleUpload(fakeEvent, currentSetter, currentImageType);
        setShowCropModal(false);
      }, "image/jpeg");
    };
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setCurrentImage(null);
  };

  return (
    <>
      <div
        className="cover-image"
        style={{
          backgroundImage: `url(${bgImage?.imageUrl ? bgImage.imageUrl : gallery})`,
          backgroundSize: bgImage?.imageUrl ? "cover" : "2rem",
          backgroundPosition: bgImage?.imageUrl ? "center" : "center 3rem",
        }}
      >
        <label htmlFor="bg_img">
          {isphotoView && <img className="camera-cover cursor-pointer" src={camera} alt="" />}
        </label>
        <input
          type="file"
          accept="image/*"
          id="bg_img"
          hidden
          onChange={(e) => processFile(e, setBgImage, "banner_image")}
        />
        {uploadProfile && (
          <div className="profile-image">
            <div className="upload-profile">
              <img
                src={profileImage?.imageUrl ? profileImage.imageUrl : dummy}
                alt="dummy-profile"
                className={`${profileImage?.imageUrl ? "h-100 w-100" : ""} rounded-circle`}
                style={{ objectFit: "cover" }}
              />

              <input
                type="file"
                accept="image/*"
                id="pfp_img"
                hidden
                onChange={(e) => processFile(e, setProfileImage, "profile_image")}
              />
              <label htmlFor="pfp_img">
                {isphotoView &&
                  <img className="profile-camera cursor-pointer" src={camera} alt="" />}
              </label>
            </div>
          </div>
        )}
      </div>

      <Modal
        title={`Crop ${currentImageType === "profile_image" ? "Profile" : "Background"} Image`}
        open={showCropModal}
        onCancel={handleCropCancel}
        footer={[
          <Button key="cancel" onClick={handleCropCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleCropConfirm}>
            Crop & Apply
          </Button>,
        ]}

        width={600}
      >
        <div className="crop-container">
          <Cropper
            image={currentImage}
            crop={crop}
            zoom={zoom}
            aspect={currentImageType === "profile_image" ? 1 : 16 / 9}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape={currentImageType === "profile_image" ? "round" : "rect"}
          />
        </div>
        <div className="slider-container" style={{ marginTop: "15px" }}>
          <p>Zoom</p>
          <Slider min={1} max={3} step={0.1} value={zoom} onChange={setZoom} />
        </div>
      </Modal>
    </>
  );
};

export default ImageUpload;
