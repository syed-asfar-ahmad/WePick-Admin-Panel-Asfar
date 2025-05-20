import React, { useEffect, useState } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import "./events.scss";

import profile from "../../assets/icons/profile.svg";
import stop from "../../assets/icons/stop.svg";
import clock from "../../assets/icons/clock.svg";
import list from "../../assets/icons/list.svg";
import locationIcon from "../../assets/icons/location.svg";

import { tickSvg } from "../../assets/icons";
import { useLocation, useParams } from "react-router-dom";
import { getEventById } from "../../services/service";
import { Box, CircularProgress } from "@mui/material";
import PageLoader from "../../components/common/PageLoader";

const EventView = () => {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [remainingTime, setRemainingTime] = useState("");
  const [linkBreadCrum, setLinkBreadCrum] = useState("/events");
  const [loader, setLoader] = useState(false);
  const location = useLocation();

  const handleGetEventData = async () => {
    setLoader(true);
    try {
      const response = await getEventById({ id });
      if (response?.success) {
        const newEvent = response?.data;
        setEvent(newEvent);
        calculateRemainingTime(newEvent.endDateAndTime);
        setLoader(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const calculateRemainingTime = (startDateAndTime) => {
    const eventDate = new Date(startDateAndTime);
    const currentDate = new Date();
    const difference = eventDate - currentDate;

    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setRemainingTime(`${hours} hours and ${minutes} minutes`);
    } else {
      setRemainingTime("Event has started or already ended");
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  useEffect(() => {
    handleGetEventData();
    const interval = setInterval(() => {
      calculateRemainingTime(event.startDateAndTime);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [event.startDateAndTime]);

  const formatDateTime = (dateString) => {
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const date = new Date(dateString)
      .toLocaleDateString("en-US", options)
      .replace(",", "");
    const time = new Date(dateString)
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
    return `${date} at ${time}`;
  };

  const EventsDetails = [
    {
      image: profile,
      text: (
        <>
          Event by{" "}
          <span style={{ color: "black", fontWeight: "600" }}>
            {event?.user?.userName || "Unknown"}
          </span>{" "}
          hosted by{" "}
          {event?.hosts?.length > 0
            ? event.hosts.map((host, index) => (
                <span key={host._id} style={{ color: "black", fontWeight: "600" }}>
                  {index > 0 ? ", " : ""}
                  {host?.userName}
                </span>
              ))
            : "Unknown"}
        </>
      ),
    }, 
    {
      image: locationIcon,
      text: event.location || "Location not specified",
    },
    {
      image: stop,
      text: `${event?.eventIntersteCount} interested`,
    },

    {
      image: clock,
      text: `Starts at ${
        event.startDateAndTime ? formatDateTime(event.startDateAndTime) : "N/A"
      }`,
    },
    {
      image: clock,
      text: `Ends at ${
        event.endDateAndTime ? formatDateTime(event.endDateAndTime) : "N/A"
      }`,
    },

    {
      image: list,
      text: event?.detail || "No description available",
    },
  ];
  useEffect(() => {
    console.log("Location state:", location.state);

    if (location.state?.from === "/moderation/events") {
      setLinkBreadCrum("/moderation/events");
    }
    handleGetEventData();
  }, [location.state, id]);

  if (loader) {
    return <PageLoader />;
  }

  return (
    <div className="row px-2 pt-4">
      <div className="col-12">
        <div className="row d-flex align-items-end">
          <div className="col-12">
            <ListHeader
              mainHeading="Events"
              placeholder="Search Title"
              linkBreadCrum={linkBreadCrum}
              blinkBreadCrumText="Events"
              blinkBreadCrumText1="Event View"
              searchShow={false}
            />
          </div>
        </div>
      </div>
      <div className="parent-box pt-4 mt-3">
        <div className="content-box">
          {event?.imgurl && (
            <img src={event?.imgurl} className="event-image" alt="Event" />
          )}
          <div
            className="event-head"
            style={{ marginTop: event?.imgurl ? "0px" : "24px" }}
          >
            <p className="event-timer">{remainingTime}</p>
            <p className="event-name">{event?.eventName}</p>
            <p className="event-verification">
              Verified by Wepick <span>{tickSvg}</span>
            </p>
          </div>
          <div className="event-details">
            {EventsDetails?.map((data, index) => (
              <div key={index} className="icons-main">
                <img
                  src={data.image}
                  alt={`Event detail ${index + 1}`}
                  className="event-detail-icon"
                />
                <p className="detail-description">{data?.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventView;
