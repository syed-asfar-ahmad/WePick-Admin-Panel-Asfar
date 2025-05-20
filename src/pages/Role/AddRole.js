import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// img svg
import RightArrow from "../../assets/images/doctor/RightArrow.svg";
import './AddRole.scss'
import useDeleteData from '../../customHook/useDelete';
import { CustomToast } from '../../atoms/toastMessage';
import Phone from '../../atoms/phone';
import { Controller, useForm } from 'react-hook-form';
import SelectCountry from '../../atoms/Country';
import SelectState from '../../atoms/State';
import CustomDropDown from '../../atoms/CustomDropDown/Index';
import UploadProfile from '../../atoms/uploadProfile/UploadProfile';
import usePost from '../../customHook/usePost';
import { useEffect } from 'react';

const AddRole = ({ role_Id, upperData = true, roleParent, setAddRole, addRole, roleParentValidation = true, roleCategoryId, navigateLink }) => {

    // const [addRole, setAddRole] = useState({ country: "Kuwait" })
    console.log(addRole, "addRoleeeee")
    const [roleType, setRoleType] = useState([
        { value: 1, label: "Hospital Admin" },
        { value: 2, label: "Doctor Admin" },
        { value: 3, label: "Pharmacy Admin" },
        { value: 7, label: "Medical Equipment Admin" },
        { value: 4, label: "Laboratory Admin" },
        { value: 8, label: "X-ray Admin" },
    ])

    const [roleParentChild, setRoleParentChild] = useState(roleParent)
    const [role_IdParentChild, setRole_IdParentChild] = useState(role_Id)
    const [parentJoinId, setParentJoinId] = useState(roleCategoryId)

    useEffect(() => {
        // setValue('email', '')
        // setValue('password', '')
        // setAddRole((pre)=>({...pre, 'email': '', 'password': ''}))
        // reset()
    }, [])

    useEffect(() => {
        console.log("roleParent", roleParent)
        if (roleParent && (roleParent[0]?.label == "Hospital Admin" ||
            roleParent[0]?.label == "Doctor Admin" ||
            roleParent[0]?.label == "Pharmacy Admin" ||
            roleParent[0]?.label == "Medical Equipment Admin" ||
            roleParent[0]?.label == "X-ray Admin" ||
            roleParent[0]?.label == "Laboratory Admin")
        ) {
            dropDownChange(roleParent[0]?.value, "role_type_id")
            // dropDownChange(roleParent[0]?.label, "role_type")
            setRoleType(roleParent)
            setValue("role_type_id", roleParent[0]?.value)
            setValue("join_id", 0)
        }

        // dropDownChange(roleCategoryId, "join_id")

    }, [roleParentChild])

    console.log("roleCategoryId", roleCategoryId)

    useEffect(() => {
        // setAddRole({...addRole, 'join_id':roleCategoryId})
        // if(roleCategoryId){

        //     dropDownChange(roleCategoryId, "join_id")
        //     setAddRole({...addRole, "join_id": roleCategoryId})
        // }

        if (roleParent && (roleParent[0]?.label == "Hospital Admin" ||
            roleParent[0]?.label == "Doctor Admin" ||
            roleParent[0]?.label == "Pharmacy Admin" ||
            roleParent[0]?.label == "Medical Equipment Admin" ||
            roleParent[0]?.label == "X-ray Admin" ||
            roleParent[0]?.label == "Laboratory Admin")
        ) {
            setAddRole(prv => ({ ...prv, 'join_id': roleCategoryId }))
            dropDownChange(roleParent[0]?.value, "role_type_id")
            // dropDownChange(roleCategoryId, "join_id")
            setRoleType(roleParent)
            setValue("role_type_id", roleParent[0]?.value)
            setValue("join_id", 0)
        }




        // alert('12')
    }, [parentJoinId, roleParentValidation])
    console.log("parentJoinId", parentJoinId)
    console.log("roleParentValidation", roleParentValidation)
    const [dropDownData, setDropDownData] = useState([])
    const [selectedImage, setSelectedImage] = useState(null);
    const { isLoading, error, deleteData } = useDeleteData();
    const AddRoleHook = usePost()
    const [passwordType, setPasswordType] = useState("password");
    const navigate = useNavigate();
    const {
        reset,
        setValue,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const customData = useDeleteData();

    const handleChangeSelect = (value, name) => {
        setAddRole({ ...addRole, [name]: value });
    };

    const dropDownChange = (value, name) => {

        // if(roleCategoryId){
        //     setRoleType({...addRole, 'join_id': roleCategoryId})
        // }

        console.log("firstww", value, name)
        const selectedOption = roleType.find(option => option.value === value);
        console.log("asdasdselectedOption", selectedOption)
        if (selectedOption?.label === "Hospital Admin") {
            setAddRole(prv => ({ ...prv, 'role_type': 'hospitaladmin' }))
        }
        else if (selectedOption?.label === "Doctor Admin") {
            setAddRole(prv => ({ ...prv, 'role_type': 'doctor' }))
        }
        else if (selectedOption?.label === "Pharmacy Admin") {
            setAddRole(prv => ({ ...prv, 'role_type': 'pharmacist' }))
        }
        else if (selectedOption?.label === "Laboratory Admin") {
            setAddRole(prv => ({ ...prv, 'role_type': 'technologist' }))
        }
        else if (selectedOption?.label === "Medical Equipment Admin") {
            setAddRole(prv => ({ ...prv, 'role_type': 'storeadmin' }))
        }
        else if (selectedOption?.label === "X-ray Admin") {
            setAddRole(prv => ({ ...prv, 'role_type': 'radiologic' }))
        }
        else {
            setAddRole(prv => ({ ...prv, [name]: value }))
        }
        setAddRole(prv => ({ ...prv, [name]: value }))
        if (value === 1 && name === 'role_type_id'
            || value === 2 && name === 'role_type_id'
            || value === 3 && name === 'role_type_id'
            || value === 4 && name === 'role_type_id'
            || value === 7 && name === 'role_type_id'
            || value === 8 && name === 'role_type_id') {
            deleteData(`${value === 1 ? `get_hospitals`
                : value === 2 ? `get_doctors`
                    : value === 3 ? `list_pharmacies?status=1`
                        : value === 4 ? `list_laboratories?is_laboratory=1`
                            : value === 7 ? `list_pharmacies?status=0`
                                : value === 8 ? `list_laboratories?is_laboratory=0`
                                    : null}`, (response) => {
                                        console.log("dattt", response?.data)
                                        const transformedData = response?.data?.map((item) => ({
                                            value: value == 2 ? item?.user?.id : item?.id,
                                            label: value == 2 ? item?.user?.name : item?.name,
                                        }));

                                        console.log("transformedDataasd", transformedData)
                                        setDropDownData(transformedData);
                                    })
        }
    }

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }

    console.log("addRole", addRole)

    useEffect(() => {
        if (role_Id) {
            // console.log("role_Id", role_Id)
            customData.deleteData(
                `${process.env.REACT_APP_GET_ROLE_BY_ID}/${role_Id}`,
                (val) => {
                    console.log("valuedd", val?.data?.join_type?.id);
                    dropDownChange(val?.data?.role_type_id, "role_type_id")
                    setAddRole({
                        // ...val?.data,
                        // specialties: val?.data?.specialities?.map((l) => l.id),
                        join_id: val?.data?.join_type?.id,
                        role_type_id: val?.data?.role_type_id,
                        country: "Kuwait",
                        state: val?.data?.state,
                    });
                    //   
                    //   dropDownChange(val?.data?.join_type?.id, 'join_id')
                    setSelectedImage(val?.data?.profile_pic)
                    Object.entries(val?.data).forEach(([fieldName, fieldValue]) => {
                        setValue(fieldName, fieldValue);
                        // setAddRole({ ...addRole, [fieldName]: fieldValue});
                    });
                    setValue('join_id', val?.data?.join_type?.id)
                    //   setValue(
                    //     "specialties",
                    //     val?.data?.specialities?.map((l) => l.id)
                    //   );
                }
            );
        }
    }, [role_Id]);

    console.log("add_roleee", addRole)



    const handleHospitalSubmit = (event) => {




        const formData = new FormData();
        for (const key in addRole) {
            if (key === "specialties" && Array.isArray(addRole[key])) {
                addRole[key].forEach((value) => {
                    formData.append(`${key}[]`, value);
                });
            } else {
                formData.append(key, addRole[key]);
            }
        }

        AddRoleHook?.postData((role_Id ?
            `${process.env.REACT_APP_UPDATE_ROLE}/${role_Id}` :
            `${process.env.REACT_APP_ADD_ROLE}`), formData, (response) => {

                console.log("tokenwww", response)

                if (response?.success === true) {
                    CustomToast({
                        type: "success",
                        message: `Data added successfully`,
                    })
                    reset()
                    setAddRole({ country: "Kuwait", role_type_id: '' })
                    setValue('')
                    setDropDownData('')
                    setSelectedImage('')
                    if (upperData) {
                        navigate('/allroles');
                    }
                    if (navigateLink === 'doctor') {
                        navigate('/doctors');
                    }
                    if (navigateLink === 'pharmacy') {
                        navigate('/pharmacy');
                    }
                    if (navigateLink === 'hospitals') {
                        navigate('/hospitals');
                    }
                    if (navigateLink === 'laboratory') {
                        navigate('/laboratory');
                    }
                    if (navigateLink === 'xray') {
                        navigate('/xray/list');
                    }
                } else {
                    CustomToast({
                        type: "error",
                        message: `${response?.message?.role_type ? response?.message?.role_type[0] : response?.message}`,
                    })
                }
            })


    }



    return (
        <div className="row  px-2 pt-4 ">
            {upperData ? <>
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
                                <span style={{ color: "#4FA6D1" }}>MANAGE ROLES</span>
                            </p>
                        </div>

                        <div className="col-lg-6 col-12 mt-lg-0 mt-3 d-flex justify-content-end ">
                            <Link className="add-doc-link-color" to='/allroles' >
                                <button
                                    className="btn-add-doc-filter mr-2"
                                >
                                    <span className="  btn-add-doc-filter-text">All Roles</span>
                                </button>
                            </Link>

                        </div>
                    </div>
                </div>
            </> : ''}

            <form className='w-100'>
                <div className="col-12 pt-3 px-0 mb-5 pb-5">
                    <div className="row mt-4 px-3">
                        <div className="col-lg-6 pr-lg-1 doc-setting-input">
                            <UploadProfile selectedImage={selectedImage} setSelectedImage={(image) => {
                                setSelectedImage(image)
                                setAddRole({ ...addRole, 'profile_pic': image })
                            }} role_Id={role_Id} />
                        </div>
                    </div>
                    <div className="row mt-4 px-3">
                        <div className="col-lg-6 pr-lg-1 doc-setting-input">
                            <p style={{ marginBottom: '10px', fontSize: '16px' }}>Role Type</p>

                            <Controller
                                name="role_type_id"
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => (
                                    <>
                                        <CustomDropDown
                                            handleChangeSelect={(value, name) => {
                                                field.onChange(value);
                                                dropDownChange(value, name);
                                            }}
                                            option={roleType || []}
                                            name="role_type_id"
                                            field={field}
                                            value={field.value || null}
                                            onBlur={field.onBlur}
                                            disabled={!upperData}
                                        />

                                        {errors.role_type_id && (
                                            <span className="error-message">
                                                This field is required
                                            </span>
                                        )}
                                    </>
                                )}
                            />

                        </div>

                        <div className="col-lg-6 mt-lg-0 mt-4 pl-lg-1 doc-setting-input">
                            <p style={{ marginBottom: '10px', fontSize: '16px' }}>{
                                addRole?.role_type === "hospitaladmin" || addRole?.role_type_id === 1
                                    ? "Hospitals"
                                    : addRole?.role_type === "doctor" || addRole?.role_type_id === 2
                                        ? "Doctors"
                                        : addRole?.role_type === "technologist" || addRole?.role_type_id === 4
                                            ? "Laboratories"
                                            : addRole?.role_type_id === "pharmacist" || addRole?.role_type_id === 3
                                                ? "Pharmacies"
                                                : addRole?.role_type_id === "storeadmin" || addRole?.role_type_id === 7
                                                    ? "Medical Equipment"
                                                    : addRole?.role_type_id === "radiologic" || addRole?.role_type_id === 8
                                                        ? "X-ray"
                                                        : "Select Category"}</p>

                            <Controller
                                name="join_id"
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => (
                                    <>
                                        <CustomDropDown
                                            handleChangeSelect={(value, name) => {
                                                field.onChange(value);
                                                dropDownChange(value, name);
                                                console.log("vvvvvv", value, name)
                                            }}
                                            option={dropDownData || []}
                                            name="join_id"
                                            field={field}
                                            value={field.value || ''}
                                            onBlur={field.onBlur}
                                            disabled={!upperData ? upperData : dropDownData?.length < 1}
                                        />

                                        {dropDownData?.length > 0 && errors.join_id && (
                                            <span className="error-message">
                                                This field is required
                                            </span>
                                        )}
                                    </>
                                )}
                            />

                            {!upperData === false ? isLoading ? <span style={{ fontSize: "12px", color: 'grey' }}>Loading...</span> : null : null}
                        </div>
                    </div>

                    <div className="row px-3 mt-4">
                        <div className="col-lg-12 doc-setting-input">
                            <p className="doc-add-filter-text" style={{ marginBottom: '10px', fontSize: '16px' }}>Name</p>

                            <Controller
                                name="name"
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            type="text"
                                            name="name"
                                            {...field}
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setAddRole({ ...addRole, 'name': e.target.value })
                                            }}
                                            autocomplete="off"
                                        />

                                        {errors.name && (
                                            <span className="error-message">
                                                This field is required
                                            </span>
                                        )}
                                    </>
                                )}
                            />

                        </div>
                    </div>
                    <div className="row px-3 mt-4">
                        <div className="col-lg-4 doc-setting-input  pr-3 pr-lg-1 add-role-default-email" style={{ border: 'none' }}>
                            <p className="doc-add-filter-text " style={{ marginBottom: '10px', fontSize: '16px' }}>Email</p>

                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: true,
                                    pattern:
                                        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
                                }}
                                render={({ field }) => (
                                    <input
                                        className=""
                                        type="text"
                                        name="email"
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                            setAddRole({ ...addRole, 'email': e.target.value })
                                        }}
                                        autoComplete="off"
                                    />
                                )}
                            />
                            {errors.email &&
                                errors.email.type === "required" && (
                                    <span className="error-message">
                                        This field is required
                                    </span>
                                )}
                            {errors.email &&
                                errors.email.type === "pattern" && (
                                    <span className="error-message">Invalid email address</span>
                                )}


                        </div>
                        <div className="col-lg-4 px-3 px-lg-2 pt-4 pt-lg-0" style={{ border: 'none' }}>
                            <p className="doc-add-filter-text " style={{ marginBottom: '10px', fontSize: '16px' }}>Password</p>
                            <div className="d-flex border px-2 add-role-default-password" style={{ height: '36px', borderRadius: '5px', backgroundColor: 'white' }}>

                                <Controller
                                    name="password"
                                    control={control}

                                    rules={{
                                        required: true,
                                        pattern:
                                            /^(?=.*[A-Z])(?=.*\d).+/i,
                                    }}
                                    render={({ field }) => (
                                        <div className='w-100'>
                                            <div className="d-flex justify-content-between loginPasswordPositionBottom input-group-btn w-100 " style={{ height: '36px' }}>
                                                <input
                                                    style={{ border: 'none', backgroundColor: 'transparent', paddingBottom: '5px' }}
                                                    type={passwordType}
                                                    name="password"
                                                    {...field}
                                                    value={field.value || ''}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        setAddRole({ ...addRole, 'password': e.target.value })
                                                    }}
                                                />

                                                <h1 className="eyeBtn btn " onMouseUp={togglePassword} onMouseDown={togglePassword} onTouchStart={togglePassword} ontouchend={togglePassword} >
                                                    <p style={{ width: "10px", height: "5px", color: "Black", border: "none" }}>{passwordType === "password" ? <i class="fa fa-eye-slash" aria-hidden="true"></i> : <i class="fa fa-eye" aria-hidden="true"></i>}</p>
                                                </h1>
                                            </div>

                                            {errors.password &&
                                                errors.password.type === "required" && (
                                                    <span className="error-message" style={{ marginLeft: '-8px' }}>
                                                        This field is required
                                                    </span>
                                                )}
                                            {errors.password &&
                                                errors.password.type === "pattern" && (
                                                    <span className="error-message" style={{ marginLeft: '-8px' }}>Strong password is required</span>
                                                )}
                                        </div>
                                    )}
                                />



                            </div>
                        </div>
                        <div className="col-lg-4 pl-3 pl-lg-1 pt-4 pt-lg-0" style={{ border: 'none' }}>

                            <Controller
                                name="contact"
                                control={control}
                                rules={{
                                    required: false,
                                }}
                                render={({ field }) => (
                                    <>
                                        <Phone
                                            label="Contact"
                                            name="contact"
                                            field={field}
                                            value={field.value}
                                            handleChange={(e) => {
                                                field.onChange(e);
                                                setAddRole({ ...addRole, 'contact': e.target.value })
                                            }}
                                        />
                                        {errors.contact && (
                                            <span className="error-message">
                                                This field is required
                                            </span>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>




                    <div className="row mt-4 px-3">
                        <div className="col-lg-6  pr-lg-1 doc-setting-input">
                            <Controller
                                name="country"
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                defaultValue="Kuwait"
                                render={({ field }) => (
                                    <>
                                        <SelectCountry
                                            notRequired={false}
                                            handleChangeSelect={(value, name) => {
                                                field.onChange(value);
                                                //   handleChange(name, value);
                                                handleChangeSelect(value, name);
                                            }}
                                            name="country"
                                            field={field}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            isDisabled={true}
                                        />

                                        {errors.country && (
                                            <span className="error-message">
                                                This field is required
                                            </span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="col-lg-6 mt-lg-0 mt-4 pl-lg-1 doc-setting-input">
                            <SelectState
                                country={addRole?.country}
                                disabled={!addRole?.country}
                                name="state"
                                value={addRole?.state || ""}
                                handleChange={handleChangeSelect}
                            />
                        </div>
                    </div>
                    {
                        console.log("roleParentValidation", roleParentValidation)
                    }
                    {roleParentValidation ? <div className="row mt-4 pl-2 ml-2">
                        <button className='Add-role-btn px-5 py-2' onClick={handleSubmit(handleHospitalSubmit)}> {role_Id ? 'Edit' : 'Add'}  Role</button>
                    </div> : null}
                </div>
            </form>
        </div>
    )
}

export default AddRole