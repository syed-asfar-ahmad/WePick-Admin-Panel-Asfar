import React from 'react'

import { DatePicker } from "antd";

import "../../assets/css/doctor.scss";
import '../../assets/css/pharmacy.scss'

import CalenderIcon from "../../assets/images/doctor/CalenderIcon.svg";

const DatePicker1 = () => {
  return (
    <div className="d-flex justify-content-between align-items-center datapicker-border">

    <DatePicker
        className=" rounded-0"
        // placeholder={"start"}
        format={"DD/MM/YYYY"}
    />

    <img className="pr-1" src={CalenderIcon} alt="" />
</div>
  )
}

export default DatePicker1