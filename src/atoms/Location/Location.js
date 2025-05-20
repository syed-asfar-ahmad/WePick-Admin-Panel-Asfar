import React from 'react'
// img svg
import LocationPickerIcon from "../../assets/images/doctor/LocationPickerIcon.svg";

const Location = ({handleLocation, locationProp='Select Location'}) => {
    return (
        <div className="d-flex justify-content-between align-items-center datapicker-border">
            <span className='pl-2'>{locationProp === 'undefined' ? '' : locationProp}</span>
            <img
                className="pr-1 cursor-pointer"
                src={LocationPickerIcon}
                alt=""
                onClick={handleLocation}
            />
        </div>
    )
}

export default Location