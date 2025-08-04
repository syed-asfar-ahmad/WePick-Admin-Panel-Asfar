import React, { useState, useEffect } from "react";

import TimeChangerUpArrow from "../../assets/images/doctor/TimeChangerUpArrow.svg";
import TimeChangerDownArrow from "../../assets/images/doctor/TimeChangerDownArrow.svg";
import { TimePicker } from "antd";

function TimeInput({ moveNext, empetyTime, currentDate, singleSelector, Time, dayId, staringTimeDrop, endTimeDrop, selector, setaddTimePostReq, addTimePostReq, elementID, dayNumber }) {

  const [time, setTime] = useState(""); // Set the initial time value



  const increment = () => {
    // Increment the time value by 1 minute
    // Convert the time to minutes and add 1, then convert back to time format
    let [hours, minutes] = time.split(":");
    minutes = parseInt(minutes);
    if (minutes < 59) {
      minutes += 1;
    } else {
      minutes = 0;
      if (hours < 23) {
        hours += 1;
      } else {
        hours = 0;
      }
    }
    setTime(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
    if (selector) {

      if (typeof staringTimeDrop === "function") {
        staringTimeDrop(time, dayId)
      }

    }
    else {

      if (typeof endTimeDrop === "function") {
        endTimeDrop(time, dayId)

      }
    }


  };

  const decrement = () => {
    // Decrement the time value by 1 minute
    // Convert the time to minutes and subtract 1, then convert back to time format
    let [hours, minutes] = time.split(":");
    minutes = parseInt(minutes);
    if (minutes > 0) {
      minutes -= 1;
    } else {
      minutes = 59;
      if (hours > 0) {
        hours -= 1;
      } else {
        hours = 23;
      }
    }
    setTime(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
  };
  const setTimeOnChange = (value) => {
    if (typeof setaddTimePostReq === "function") {
      singleSelector ?
        setaddTimePostReq({
          ...addTimePostReq,
          schedules: addTimePostReq?.schedules.map((schedule) =>
            schedule?.day === dayNumber
              ? {
                ...schedule,
                time_slots: schedule.time_slots?.map((timeSlot) =>
                  timeSlot?.uniVal === elementID
                    ? {
                      ...timeSlot,
                      start_time: value.target.value,
                    }
                    : timeSlot
                ),
              }
              : schedule
          ),
        }) : setaddTimePostReq({
          ...addTimePostReq,
          schedules: addTimePostReq?.schedules.map((schedule) =>
            schedule?.day === dayNumber
              ? {
                ...schedule,
                time_slots: schedule.time_slots?.map((timeSlot) =>
                  timeSlot?.uniVal === elementID
                    ? {
                      ...timeSlot,
                      end_time: value.target.value,
                    }
                    : timeSlot
                ),
              }
              : schedule
          ),
        })
    }
    setTime(value.target.value)
    if (selector) {

      if (typeof staringTimeDrop === "function" && (singleSelector === undefined || singleSelector === null)) {
        staringTimeDrop(value.target.value, dayId)

      }
    }
    else {
      if (typeof endTimeDrop === "function" && (singleSelector === undefined || singleSelector === null)) {
        endTimeDrop(value.target.value, dayId)

      }

    }


  }

  return (
    <>
      <div className="d-inline-flex time-picker time-picker-modify py-0 px-2 mt-1" style={{height:'36.6px'}}>
        {/* <input
          type="time"
          value={Time ?? time}
          onChange={(e) => {
            setTimeOnChange(e)
          }}
          min="00:00"
          max="23:59"
          step="60"
          className="pl-1"
        /> */}

        <TimePicker
          format="HH:mm"
          size="large"
          placeholder={Time.slice(0,5) ?? time.slice(0,5)}
          style={{ width: "100%", border: "none", height:'36px' }}
          onChange={(momentValue, stringValue) => {
            // Convert momentValue to a string in 'HH:mm' format
            const formattedTime = momentValue.format('HH:mm');

            setTimeOnChange({ target: { value: formattedTime } });
          }}
        />

        {/* <div className="pl-4 d-flex justify-content-center flex-column d-none" >
          <img
            className="d-block pl-2 pr-1 pb-1 cursor-pointer"
            onClick={increment}
            src={TimeChangerUpArrow}
            alt=""
          />
          <img
            className="d-block pl-2 pr-1 cursor-pointer"
            onClick={decrement}
            src={TimeChangerDownArrow}
            alt=""
          />
        </div> */}

      </div>
    </>
  );
}

export default TimeInput;
