import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Switch } from 'antd';

// img svg
import RightArrow from "../../assets/images/doctor/RightArrow.svg";
import AddRoleModal from '../../molecules/AddRoleModal/AddRoleModal';

const RolePermission = () => {
    const [modal1Open, setModal1Open] = useState(false);

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const userName = params.get('name');

    const data = [
        {
            text1: 'Hospital Dashboard',
            text2: 'Basic Information',
        },
        {
            text1: 'Appointments',
            text2: 'Basic Information',
        },
        {
            text1: 'Doctors',
            text2: 'Basic Information',
        },
        {
            text1: 'Patients',
            text2: 'Basic Information',
        },
        {
            text1: 'Pharmacy',
            text2: 'Basic Information',
        },
        {
            text1: 'Laboratory',
            text2: 'Basic Information',
        },
        {
            text1: 'Blood Test',
            text2: 'Basic Information',
        },
        {
            text1: 'X-Rays',
            text2: 'Basic Information',
        },
        {
            text1: 'Blood Donation',
            text2: 'Basic Information',
        },
        {
            text1: 'Home Service Provider',
            text2: 'Basic Information',
        },
        {
            text1: 'Treatment Sponsor',
            text2: 'Basic Information',
        },
        {
            text1: 'Pharmasist',
            text2: 'Basic Information',
        },
        {
            text1: 'Laboratory Technologist',
            text2: 'Basic Information',
        },
    ]

    return (
        <div className="fluid-container">
            <div className="row px-2 pt-4">
                <div className="col-12  ">
                    <p className="mb-0 dashboard-com-top-text">Manage Roles</p>
                </div>

                <div className="col-12  ">
                    <div className="row d-flex align-items-end">
                        <div className="col-lg-6 col-12 mt-lg-0 mt-2">
                            <p className="mb-0 doctor-header-top-text">
                                <Link className="doc-link " to="/">
                                    DASHBOARD
                                </Link>
                                <img
                                    className="mx-lg-3 ml-2 pr-1 pb-1"
                                    src={RightArrow}
                                    alt=""
                                />
                                <span style={{ color: "#4FA6D1" }}>{userName}</span>
                            </p>
                        </div>

                        <div className="col-lg-6 col-12 mt-lg-0 mt-3 d-flex justify-content-end ">
                            <button
                                className="btn-add-doc-filter mr-2"
                                
                            ><Link className="add-doc-link-color" to='/allroles' >
                                <span className="  btn-add-doc-filter-text">All Roles</span>
                                </Link>
                            </button>
                            <button className="btn-add-new-doc" onClick={() => setModal1Open(true)}>
                                
                                    Add Roles
                                
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12 mt-lg-0 pt-lg-0 mt-md-3 pt-md-4 pb-5 px-0" style={{ overflowX: "hidden" }}>
                    <div className="row px-3 mt-lg-3 mt-md-0 mt-4">
                        <div className="col-12 my-lg-5" >
                            <div className='permission-role px-md-4 px-3 py-4 mb-md-0 mb-5'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <p className='mb-0 permission-role-text1 py-1'>{userName}</p>
                                    <div className='d-flex justify-content-between align-items-center permission-col-width' >
                                        <p className='mb-0 permission-role-text1'>View</p>
                                        <p className='mb-0 permission-role-text1'>Manage</p>
                                    </div>
                                </div>

                                {
                                    data.map(({ text1, text2 }) => {
                                        return (
                                            <div className='d-flex justify-content-between py-md-4 py-2'>
                                                <div>
                                                    <p className='mb-0 permission-role-text1'>{text1}</p>
                                                    <p className='mb-0 permission-role-text2'>Basic Information</p>
                                                </div>
                                                <div className='d-flex justify-content-between permission-col-width' >
                                                    <Switch defaultChecked />
                                                    <Switch defaultChecked />
                                                </div>
                                            </div>
                                        )
                                    })
                                }


                            </div>
                        </div>
                    </div>
                    <AddRoleModal modal1Open={modal1Open} setModal1Open={(data)=>{setModal1Open(data)}} typeName='Add' />
                </div>
            </div>


            
        </div>
    )
}

export default RolePermission