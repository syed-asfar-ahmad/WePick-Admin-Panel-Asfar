import React, { useState, useEffect } from "react";
import { Modal, TimePicker } from "antd";
import { Space, Switch } from "antd";
import usePost from "../../customHook/usePost";
import CustomDropDown from "../../atoms/CustomDropDown/timeSlotDropDown";
import TimeChanger from "../../atoms/TimeslotChanger/TimeChanger";
import TimeTableRemoveBtn from "../../assets/images/doctor/dash-circle-fill-red.svg";
import TimeTableAddBtn from "../../assets/images/doctor/TimeTableAddBtn.svg";
import useFetch from "../../customHook/useFetch";
import useDeleteData from "../../customHook/useDelete";

const TimeModal = ({ Id }) => {
  const [doctorTimeTable, setDoctorTimeTable] = useState([]);
  const [specialistOptions, setSpecialistOptions] = useState([]);
  const { postData } = usePost();
  const [addTimePostReq, setAddTimePostReq] = useState({
    doctor_id: 131,
    schedules: [{}],
  });
  console.log(addTimePostReq, "addTimePostReq-->");
  const [addSingleTimeSlot, setaddSingleTimeSlot] = useState({
    hospital_id: "",
    start_time: "",
    end_time: "",
  });
  const { data, isLoading, error } = useFetch(
    `${process.env.REACT_APP_DOCTOR_DETAIL}/${Id}`
  );
  const { deleteData, isLoadingTimeTable, errorTimeTable } = useDeleteData();
  const getTimeTableData = () => {
    deleteData(
      `${process.env.REACT_APP_GET_DOCTOR_TIMETABLE}/${131}`,
      (Data) => {
        // console.log(Data, "API");
        setDoctorTimeTable(Data?.data?.schedules);
        console.log("newwww", data, Data);
        setSpecialistOptions(
          data?.data?.hospitals?.map((i) => {
            return { value: i.name, label: i.name, id: i.id };
          })
        );
      }
    );
  };
  const deleteTimeSlot = (dayName, hospitalID) => {
    setAddTimePostReq({
      ...addTimePostReq,
      schedules: addTimePostReq?.schedules?.map((schedule) => {
        if (schedule.day === dayName) {
          return {
            ...schedule,
            time_slots: [],
          };
        }
        return {
          ...schedule,
          time_slots: [...(schedule?.time_slots || [])],
        };
      }),
    });
  };

  let filterTimeAvalibility = (dayID) => {
    let filteredSchedules = addTimePostReq?.schedules?.filter(
      (tableFilter) => tableFilter.day === dayID
    );
    return [filteredSchedules[0]?.time_slots, dayID];
  };

  const appendSingleTimeSlot = (dayIndex) => {
    // if (addSingleTimeSlot?.hospital_id && addSingleTimeSlot?.start_time && addSingleTimeSlot.end_time) {
    setAddTimePostReq({
      ...addTimePostReq,
      schedules: addTimePostReq?.schedules?.map((schedule) =>
        schedule?.day === dayIndex
          ? {
            ...schedule,
            time_slots: [...schedule?.time_slots, addSingleTimeSlot],
          }
          : schedule
      ),
    });
    // }
    console.log(addTimePostReq, "addSingleTimeSlot--->");
  };
  const handleChangeSelect = (val, name, updatedValue, dayID, setAblID) => {
    let data = specialistOptions.filter((value) => {
      return value.value === val;
    })[0]?.id;
    setAddTimePostReq({
      ...addTimePostReq,
      schedules: addTimePostReq?.schedules?.map((schedule) =>
        schedule?.day === dayID
          ? {
            ...schedule,
            time_slots: schedule?.time_slots?.map((timeSlot) =>
              timeSlot?.uniVal === updatedValue
                ? {
                  ...timeSlot,
                  hospital_id: data,
                }
                : timeSlot
            ),
          }
          : schedule
      ),
    });
  };

  const deleteSingleTimeSlot = (day, elementID) => {
    setAddTimePostReq({
      ...addTimePostReq,
      schedules: addTimePostReq?.schedules?.map((schedule) =>
        schedule.day === day
          ? {
            ...schedule,
            time_slots: schedule.time_slots.filter(
              (timeSlot) => timeSlot.uniVal !== elementID
            ),
          }
          : schedule
      ),
    });
  };

  function renderLoop(countDays = [], dayName, dayNumber) {
    var actualDay = countDays[0];
    const items = [];

    // countDays[0]?.length !== 0 ? setSelectDay({ ...selectDay, [selectDay[dayName].toggle]: false }):setSelectDay(selectDay)

    for (let i = 0; i < actualDay?.length; i++) {
      const isLastElement = i === actualDay.length - 1;

      actualDay[i].uniVal = Math.random().toString(36).substr(2, 9);
      let hospitalName = specialistOptions?.filter((e) => {
        return e?.id === actualDay[i]?.hospital_id;
      })[0]?.label;

      items.push(
        <>
          <div
            className={`${countDays === 1 ? "" : "pb-3"} `}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div style={{ width: "141px" }}>
                <CustomDropDown
                  option={specialistOptions}
                  handleChangeSelect={handleChangeSelect}
                  setAblID={actualDay[i]?.hospital_id}
                  value={hospitalName ?? actualDay[i]?.hospital_id}
                  updatedValue={actualDay[i]?.uniVal}
                  dayId={dayNumber}
                />
              </div>

              {/* .slice(0, -3) */}
              <TimeChanger
                Time={actualDay[i]?.start_time}
                setAddTimePostReq={setAddTimePostReq}
                addTimePostReq={addTimePostReq}
                elementID={actualDay[i].uniVal}
                dayNumber={dayNumber}
                singleSelector={true}
              />

           

              <TimeChanger
                Time={actualDay[i]?.end_time}
                setAddTimePostReq={setAddTimePostReq}
                addTimePostReq={addTimePostReq}
                elementID={actualDay[i].uniVal}
                dayNumber={dayNumber}
                singleSelector={false}
              />
            </div>
            {!isLastElement ? (
              <span className="pl-lg-3 pl-1">
                <img
                  className="cursor-pointer"
                  onClick={() => {
                    deleteSingleTimeSlot(countDays[1], actualDay[i]?.uniVal);
                    // decreaseDayCount(dayName)
                    // deleteTimeSlot(dayName, countDays[i]?.hospital_id)
                  }}
                  src={TimeTableRemoveBtn}
                  alt=""
                  style={{ width: "20px" }}
                />
              </span>
            ) : (
              <>
                <span className="pl-lg-3 pl-1">
                  <img
                    className="cursor-pointer"
                    onClick={() => {
                      deleteSingleTimeSlot(countDays[1], actualDay[i]?.uniVal);
                      // decreaseDayCount(dayName)
                      // deleteTimeSlot(dayName, countDays[i]?.hospital_id)
                    }}
                    src={TimeTableRemoveBtn}
                    alt=""
                    style={{ width: "20px" }}
                  />
                </span>
                <span className="pl-lg-3 pl-1">
                  <img
                    className="cursor-pointer"
                    onClick={() => {
                      // increaseDayCount("sunday")
                      appendSingleTimeSlot(dayNumber);
                    }}
                    src={TimeTableAddBtn}
                    alt=""
                  />
                </span>
              </>
            )}
          </div>
        </>
      );
    }

    return items;
  }

  const [selectDay, setSelectDay] = useState({
    sunday: {
      toggle: true,
      count: 1,
    },
    monday: {
      toggle: true,
      count: 1,
    },
    tuesday: {
      toggle: true,
      count: 1,
    },
    wednesday: {
      toggle: true,
      count: 1,
    },
    thursday: {
      toggle: true,
      count: 1,
    },
    friday: {
      toggle: true,
      count: 1,
    },
    saturday: {
      toggle: true,
      count: 1,
    },
  });

  const postDoctorAvalibility = () => {
    postData(
      `${process.env.REACT_APP_SET_DOCTOR_AVaAILABILITY}`,
      addTimePostReq
    );
  };
  useEffect(() => {
    setAddTimePostReq({
      ...addTimePostReq,
      schedules: [...doctorTimeTable],
    });
  }, [doctorTimeTable]);
  useEffect(() => {
    getTimeTableData();
  }, []);
  return (
    <>
      <div className="row px-2 border-bottom">
        <div className="col-12 ">
          <p className="doc-add-filter">Time Table</p>
        </div>
      </div>

      <div className="row px-3 mt-4">
        <p className=" mb-0 time-edit-text1">Set Standard Hours</p>
      </div>

      <div className="row px-3  mt-lg-4 mb-1">
        <div className="col-lg-4 px-1 d-flex justify-content-end align-items-start pt-1 ">
          <div
            className="  mb-lg-3 d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            <span className="time-edit-days-name">Sunday</span>
            <Space direction="vertical">
              <Switch
                size={300}
                defaultChecked
                onClick={(e) => {
                  setSelectDay((prevState) => ({
                    ...prevState,
                    sunday: {
                      ...prevState.sunday,
                      toggle: !prevState.sunday.toggle,
                    },
                  }));
                  selectDay?.sunday.toggle
                    ? deleteTimeSlot(1)
                    : deleteTimeSlot();
                }}
              />
            </Space>
          </div>
        </div>

        <div className="col-lg-8 d-flex  flex-column  align-items-lg-end align-items-md-center align-items-start">
          {
            // selectDay.sunday.toggle && addTimePostReq?.schedules[1]?.time_slots.length === 0
            true
              ? null
              : //       < div className="mb-3" style={{ width: "100%", display: 'flex', justifyContent: "space-around", alignItems: "center" }}>
              //   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              //     <div style={{ width: "141px" }}>
              //       <CustomDropDown option={specialistOptions} hospitalDopDown={hospitalDopDown} dayId={1} handleChangeSelect={handleChangeSelect} />
              //     </div>

              //     <TimeChanger staringTimeDrop={staringTimeDrop} dayId={1} selector={true} empetyTime={empetyTime} />

              //     <TimeChanger endTimeDrop={endTimeDrop} dayId={1} selector={false} empetyTime={empetyTime} />

              //   </div>
              //   <span className="pl-lg-3 pl-1">
              //     <img
              //       className="cursor-pointer"
              //       onClick={() => {
              //         increaseDayCount("sunday")
              //         appendSingleTimeSlot(1)
              //       }}
              //       src={TimeTableAddBtn}
              //       alt=""

              //     />
              //   </span>

              // </div>

              null
          }

          {selectDay.sunday.toggle &&
            renderLoop(filterTimeAvalibility(1), "sunday", 1)}
        </div>
      </div>

      <div className="row px-3  mb-1">
        <div className="col-lg-4 px-1 d-flex justify-content-end align-items-start pt-1 ">
          <div
            className="  mb-lg-3 d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            <span className="time-edit-days-name">Monday</span>
            <Space direction="vertical">
              <Switch
                size={300}
                defaultChecked
                onClick={() => {
                  setSelectDay((prevState) => ({
                    ...prevState,
                    monday: {
                      ...prevState.monday,
                      toggle:
                        !addTimePostReq?.schedules[1]?.time_slots.length > 0,
                    },
                  }));
                  selectDay?.monday.toggle
                    ? deleteTimeSlot(2)
                    : deleteTimeSlot();
                }}
              />
            </Space>
          </div>
        </div>
        {console.log(
          "toggle",
          addTimePostReq?.schedules[1]?.time_slots.length < 0
        )}
        <div className="col-lg-8 d-flex  flex-column  align-items-lg-end align-items-md-center">
          {selectDay.monday.toggle
            ? //  &&  addTimePostReq?.schedules[2]?.time_slots.length === 0

            null
            : // <div className="mb-3" style={{ width: "100%", display: 'flex', justifyContent: "space-around", alignItems: "center" }}>
            //   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            //     <div style={{ width: "141px" }}>
            //       <CustomDropDown option={specialistOptions} hospitalDopDown={hospitalDopDown} dayId={2} handleChangeSelect={handleChangeSelect} />
            //     </div>

            //     <TimeChanger staringTimeDrop={staringTimeDrop} dayId={2} selector={true} />

            //     <TimeChanger endTimeDrop={endTimeDrop} dayId={2} selector={false} />

            //   </div>
            //   <span className="pl-lg-3 pl-1">
            //     <img
            //       className="cursor-pointer"
            //       onClick={() => {
            //         increaseDayCount("monday")
            //         appendSingleTimeSlot(2)
            //       }}
            //       src={TimeTableAddBtn}
            //       alt=""
            //     />
            //   </span>

            // </div>

            null}
          {selectDay.monday.toggle &&
            renderLoop(filterTimeAvalibility(2), "monday", 2)}
        </div>
      </div>

      <div className="row px-3  mb-1">
        <div className="col-lg-4 px-1 d-flex justify-content-end align-items-start pt-1 ">
          <div
            className="  mb-lg-3 d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            <span className="time-edit-days-name">Tuesday</span>

            <Space direction="vertical">
              <Switch
                size={300}
                defaultChecked
                onClick={() => {
                  setSelectDay((prevState) => ({
                    ...prevState,
                    tuesday: {
                      ...prevState.tuesday,
                      toggle: !prevState.tuesday.toggle,
                    },
                  }));
                  selectDay?.tuesday.toggle
                    ? deleteTimeSlot(3)
                    : deleteTimeSlot();
                }}
              />
            </Space>
          </div>
        </div>

        <div className="col-lg-8 d-flex  flex-column  align-items-lg-end align-items-md-center">
          {selectDay.tuesday.toggle
            ? // <div className="mb-3" style={{ width: "100%", display: 'flex', justifyContent: "space-around", alignItems: "center" }}>
            //   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            //     <div style={{ width: "141px" }}>
            //       <CustomDropDown option={specialistOptions} hospitalDopDown={hospitalDopDown} dayId={3} handleChangeSelect={handleChangeSelect} />
            //     </div>

            //     <TimeChanger staringTimeDrop={staringTimeDrop} dayId={3} selector={true} />

            //     <TimeChanger endTimeDrop={endTimeDrop} dayId={3} selector={false} />

            //   </div>
            //   <span className="pl-lg-3 pl-1">
            //     <img
            //       className="cursor-pointer"
            //       onClick={() => {
            //         increaseDayCount("tuesday")
            //         appendSingleTimeSlot(3)
            //       }}
            //       src={TimeTableAddBtn}
            //       alt=""
            //     />
            //   </span>

            // </div>
            null
            : null}
          {selectDay.tuesday.toggle &&
            renderLoop(filterTimeAvalibility(3), "tuesday", 3)}
        </div>
      </div>

      <div className="row px-3  mb-1">
        <div className="col-lg-4 px-1 d-flex justify-content-end align-items-start pt-1 ">
          <div
            className="  mb-lg-3 d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            <span className="time-edit-days-name">Wednesday</span>
            <Space direction="vertical">
              <Switch
                size={300}
                defaultChecked
                onClick={() => {
                  setSelectDay((prevState) => ({
                    ...prevState,
                    wednesday: {
                      ...prevState.wednesday,
                      toggle: !prevState.wednesday.toggle,
                    },
                  }));
                  selectDay?.wednesday.toggle
                    ? deleteTimeSlot(4)
                    : deleteTimeSlot();
                }}
              />
            </Space>
          </div>
        </div>

        <div className="col-lg-8 d-flex  flex-column  align-items-lg-end align-items-md-center">
          {selectDay.wednesday.toggle
            ? // <div className="mb-3" style={{ width: "100%", display: 'flex', justifyContent: "space-around", alignItems: "center" }}>
            //   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            //     <div style={{ width: "141px" }}>
            //       <CustomDropDown option={specialistOptions} hospitalDopDown={hospitalDopDown} dayId={4} handleChangeSelect={handleChangeSelect} />
            //     </div>

            //     <TimeChanger staringTimeDrop={staringTimeDrop} selector={true} dayId={4} />

            //     <TimeChanger endTimeDrop={endTimeDrop} selector={false} dayId={4} />

            //   </div>
            //   <span className="pl-lg-3 pl-1">
            //     <img
            //       className="cursor-pointer"
            //       onClick={() => {
            //         increaseDayCount("wednesday")
            //         appendSingleTimeSlot(4)
            //       }}
            //       src={TimeTableAddBtn}
            //       alt=""
            //     />
            //   </span>

            // </div>
            null
            : null}
          {selectDay.wednesday.toggle &&
            renderLoop(filterTimeAvalibility(4), "wednesday", 4)}
        </div>
      </div>

      <div className="row px-3  mb-1">
        <div className="col-lg-4 px-1 d-flex justify-content-end align-items-start pt-1 ">
          <div
            className="  mb-lg-3 d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            <span className="time-edit-days-name">Thursday</span>
            <Space direction="vertical">
              <Switch
                size={300}
                defaultChecked
                onClick={() => {
                  setSelectDay((prevState) => ({
                    ...prevState,
                    thursday: {
                      ...prevState.thursday,
                      toggle: !prevState.thursday.toggle,
                    },
                  }));
                  selectDay?.thursday.toggle
                    ? deleteTimeSlot(5)
                    : deleteTimeSlot();
                }}
              />
            </Space>
          </div>
        </div>

        <div className="col-lg-8 d-flex  flex-column  align-items-lg-end align-items-md-center">
          {selectDay.thursday.toggle
            ? // <div className="mb-3" style={{ width: "100%", display: 'flex', justifyContent: "space-around", alignItems: "center" }}>
            //   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            //     <div style={{ width: "141px" }}>
            //       <CustomDropDown option={specialistOptions} hospitalDopDown={hospitalDopDown} dayId={5} handleChangeSelect={handleChangeSelect} />
            //     </div>

            //     <TimeChanger staringTimeDrop={staringTimeDrop} selector={true} dayId={5} />

            //     <TimeChanger endTimeDrop={endTimeDrop} selector={false} dayId={5} />

            //   </div>
            //   <span className="pl-lg-3 pl-1">
            //     <img
            //       className="cursor-pointer"
            //       onClick={() => {
            //         increaseDayCount("thursday")
            //         appendSingleTimeSlot(5)
            //       }}
            //       src={TimeTableAddBtn}
            //       alt=""
            //     />
            //   </span>

            // </div>
            null
            : null}

          {selectDay.thursday.toggle &&
            renderLoop(filterTimeAvalibility(5), "thursday", 5)}
        </div>
      </div>

      <div className="row px-3  mb-1">
        <div className="col-lg-4 px-1 d-flex justify-content-end align-items-start pt-1 ">
          <div
            className="  mb-lg-3 d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            <span className="time-edit-days-name">Friday</span>
            <Space direction="vertical">
              <Switch
                size={300}
                defaultChecked
                onClick={() => {
                  setSelectDay((prevState) => ({
                    ...prevState,
                    friday: {
                      ...prevState.friday,
                      toggle: !prevState.friday.toggle,
                    },
                  }));
                  selectDay?.friday.toggle
                    ? deleteTimeSlot(6)
                    : deleteTimeSlot();
                }}
              />
            </Space>
          </div>
        </div>

        <div className="col-lg-8 d-flex  flex-column  align-items-lg-end align-items-md-center">
          {selectDay.friday.toggle
            ? // <div className="mb-3" style={{ width: "100%", display: 'flex', justifyContent: "space-around", alignItems: "center" }}>
            //   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            //     <div style={{ width: "141px" }}>
            //       <CustomDropDown option={specialistOptions} hospitalDopDown={hospitalDopDown} dayId={6} handleChangeSelect={handleChangeSelect} />
            //     </div>

            //     <TimeChanger staringTimeDrop={staringTimeDrop} selector={true} dayId={6} />

            //     <TimeChanger endTimeDrop={endTimeDrop} selector={false} dayId={6} />

            //   </div>
            //   <span className="pl-lg-3 pl-1">
            //     <img
            //       className="cursor-pointer"
            //       onClick={() => {
            //         increaseDayCount("friday")
            //         appendSingleTimeSlot(6)
            //       }}
            //       src={TimeTableAddBtn}
            //       alt=""
            //     />
            //   </span>

            // </div>
            null
            : null}
          {selectDay.friday.toggle &&
            renderLoop(filterTimeAvalibility(6), "friday", 6)}
        </div>
      </div>

      <div className="row px-3  mb-1">
        <div className="col-lg-4 px-1 d-flex justify-content-end align-items-start pt-1 ">
          <div
            className="  mb-lg-3 d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            <span className="time-edit-days-name">Saturday</span>
            <Space direction="vertical">
              <Switch
                size={300}
                defaultChecked={true}
                onClick={() => {
                  setSelectDay((prevState) => ({
                    ...prevState,
                    saturday: {
                      ...prevState.saturday,
                      toggle: !prevState.saturday.toggle,
                    },
                  }));
                  selectDay?.thursday.toggle
                    ? deleteTimeSlot(7)
                    : deleteTimeSlot();
                }}
              />
            </Space>
          </div>
        </div>

        <div className="col-lg-8 d-flex  flex-column  align-items-lg-end align-items-md-center">
          {selectDay.saturday.toggle
            ? // <div className="mb-3" style={{ width: "100%", display: 'flex', justifyContent: "space-around", alignItems: "center" }}>
            //   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            //     <div style={{ width: "141px" }}>
            //       <CustomDropDown option={specialistOptions} hospitalDopDown={hospitalDopDown} dayId={7} handleChangeSelect={handleChangeSelect} />
            //     </div>

            //     <TimeChanger staringTimeDrop={staringTimeDrop} selector={true} dayId={7} />

            //     <TimeChanger endTimeDrop={endTimeDrop} selector={false} dayId={7} />

            //   </div>
            //   <span className="pl-lg-3 pl-1">
            //     <img
            //       className="cursor-pointer"
            //       onClick={() => {
            //         increaseDayCount("saturday")
            //         appendSingleTimeSlot(7)
            //       }}
            //       src={TimeTableAddBtn}
            //       alt=""

            //     />
            //   </span>

            // </div>
            null
            : null}
          {selectDay.saturday.toggle &&
            renderLoop(filterTimeAvalibility(7), "saturday", 7)}
        </div>
      </div>
    </>
  );
};

export default TimeModal;
