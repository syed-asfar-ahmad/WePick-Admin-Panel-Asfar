import React from 'react'

// svh img
import CameraIcon from "../../assets/images/doctor/CameraIcon.svg";

const ProfileImg = (props) => {
    const {handleUploadButtonClick, handleRemoveImageClick, selectedFile} = props
  return (
    <div className='d-flex justify-content-center align-items-center flex-column'>
    <div className='img-patient-profile mb-2 '>
      {selectedFile?
        <img className='w-100 h-100 rounded-circle'  src={selectedFile} alt="Selected file" onClick={handleUploadButtonClick} />:
      <div className='img-patient-profile-dummy d-flex justify-content-center '>
        <img className='pt-2 mt-1' src={CameraIcon} alt="" onClick={handleUploadButtonClick} />
      </div>
      }
    </div>
    <div>
      <button className='update-img-patient-profile mr-1' onClick={handleUploadButtonClick}>Upload </button>
      <button className='remove-img-patient-profile ml-1' onClick={handleRemoveImageClick}>Remove </button>
    </div>
  </div>
  )
}

export default ProfileImg