import React from 'react'

// svg
import NotificationIcon from "../../assets/images/dashboard/NotificationIcon.svg";
import MedicineIcon from "../../assets/images/dashboard/MedicineIcon.svg";
import MicroscopeIcon from "../../assets/images/dashboard/MicroscopeIcon.svg";
import PatientNameIcon from "../../assets/images/dashboard/PatientNameIcon.svg";
import FirstAidBoxIcon from "../../assets/images/dashboard/FirstAidBoxIcon.svg";

// png
import SampleImg from "../../assets/images/dashboard/SampleImg.png";

const NotificationDropDown = () => {
    return (
        <>
        

            <div class="dropdown">
                <div
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    className=" cursor-pointer menu-button p-4 mr-2 d-flex align-items-center justify-content-center"
                >
                    <img src={NotificationIcon} alt="" />
                </div>

                <div
                    class="  notification-drop-down-body dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                >
                    <div className="row  px-3">
                        <div className="col-2 py-4 border-bottom">
                            <img
                                className="noti-drop-down-img"
                                src={SampleImg}
                                alt=""
                            />
                        </div>

                        <div className="col-10 py-4 border-bottom px-0 d-flex  justify-content-center align-items-start  flex-column">
                            <p className="mb-0 pr-4 noti-drop-down-text1">
                                An appointment is received by Calvin
                            </p>

                            <p className="mb-0 noti-drop-down-text2">
                                1 hour ago
                            </p>
                        </div>
                    </div>

                    <div className="row  px-3">
                        <div className="col-2 py-4 border-bottom">
                            <img
                                className="pl-2 noti-drop-down-img0"
                                src={MedicineIcon}
                                alt=""
                            />
                        </div>

                        <div className="col-10 py-4 border-bottom px-0 d-flex  justify-content-center align-items-start  flex-column">
                            <p className="mb-0 pr-4 noti-drop-down-text1">
                                Panadol is booked by Sufian
                            </p>

                            <p className="mb-0 noti-drop-down-text2">
                                1 hour ago
                            </p>
                        </div>
                    </div>

                    <div className="row   px-3">
                        <div className="col-2 py-4 border-bottom">
                            <img
                                className=" pl-1 noti-drop-down-img1"
                                src={MicroscopeIcon}
                                alt=""
                            />
                        </div>

                        <div className="col-10 py-4 border-bottom px-0 d-flex  justify-content-center align-items-start  flex-column">
                            <p className="mb-0 pr-4 noti-drop-down-text1">
                                Haematology test is booked by Sufian
                            </p>

                            <p className="mb-0 noti-drop-down-text2">
                                1 hour ago
                            </p>
                        </div>
                    </div>

                    <div className="row  px-3">
                        <div className="col-2 py-4 border-bottom">
                            <img
                                className="pl-2 noti-drop-down-img2"
                                src={PatientNameIcon}
                                alt=""
                            />
                        </div>

                        <div className="col-10 py-4 border-bottom px-0 d-flex  justify-content-center align-items-start  flex-column">
                            <p className="mb-0 pr-4 noti-drop-down-text1">
                                Treatment Sponsor request is submitted by Ali
                            </p>

                            <p className="mb-0 noti-drop-down-text2">
                                1 hour ago
                            </p>
                        </div>
                    </div>

                    <div className="row  px-3">
                        <div className="col-2 py-4 ">
                            <img
                                className="pl-2 noti-drop-down-img3"
                                src={FirstAidBoxIcon}
                                alt=""
                            />
                        </div>

                        <div className="col-10 py-4  px-0 d-flex  justify-content-center align-items-start  flex-column">
                            <p className="mb-0 pr-4 noti-drop-down-text1">
                                Service Provider request is submitted by Raza
                            </p>

                            <p className="mb-0 noti-drop-down-text2">
                                1 hour ago
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotificationDropDown