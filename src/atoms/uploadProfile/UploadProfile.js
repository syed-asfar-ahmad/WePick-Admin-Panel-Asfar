import React, { useState } from 'react';
import CameraIcon from "../../assets/images/doctor/CameraIcon.svg";
import './uploadProfile.scss'

function ImageUploader({ selectedImage ,setSelectedImage, role_Id}) {
    
    const [ role_IdState, setRole_IdState] = useState(role_Id)
    const handleImageUpload = (event) => {
        const imageFile = event.target.files[0];
        setSelectedImage(imageFile);
        setRole_IdState(undefined)
    };

    const handleButtonClick = () => {
        document.getElementById('hiddenFileInput').click();
    };

    return (
        <div>
            <input
                id="hiddenFileInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
            />
            {selectedImage ? <div className='upload-profile-img-final cursor-pointer' style={{ width: "80px", height: '80px' }} onClick={handleButtonClick}>
                <img  src={ !role_IdState ?  URL.createObjectURL(selectedImage) :   process.env.REACT_APP_IMAGE_URL +
                          selectedImage} alt="Uploaded"  />
            </div> :
                <div className='upload-profile-img cursor-pointer' style={{ width: "80px", height: '80px' }} onClick={handleButtonClick} >
                    <img className='' src={CameraIcon} alt="camera_icon" />
                </div>
            }
        </div>
    );
}

export default ImageUploader;
