import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SubscriptionChart from "./wepick/SubscriptionChart";
import RankedUni from "./wepick/RankedUni";
import "./dashboard.scss";

//scss
import "../../assets/css/dashboard.scss";
//svg
import { PostSvg, UserSvg, EventSvg, DownArrowSvg } from "../../assets/icons";
import { getDashCount } from "../../services/service";

const DashboardCom = () => {
  const [cardData, setCardData] = useState([]);
  const handlegetData = async () => {
    try {
      const response = await getDashCount();
      if (response?.success) {
        console.log(response?.data,"response?.dataresponse?.data")
        setCardData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching university data:", error);
    }
  };

  useEffect(() => {
    handlegetData();
  }, []);
  const data1 = [
    {
      id: 1,
      text: "Total Users",
      total: cardData?.userCount,
      icon: UserSvg,
      route: "/users",
    },
    {
      id: 1,
      text: "Total Posts",
      total: cardData?.postCount,
      icon: PostSvg,
      route: "/allpost",
    },
    {
      id: 1,
      text: "Total Events",
      total: cardData?.eventCount,
      icon: EventSvg,
      route: "/events",
    },
    {
      id: 1,
      text: "Withdrawal Requests",
      total: cardData?.withdrawRequestCount,
      icon: DownArrowSvg,
      route: "/withdrawalrequests",
    },
  ];

  const [dropdownValueChange, setDropdownValueChange] = useState("");

  const handleChangeSelect = (value) => {
    setDropdownValueChange(value);
  };

  return (
    <>
      <div className="row  px-2 pt-4" style={{ overflowX: "hidden" }}>
        <div className="col-12 mt-1">
          <div className="row">
            {data1.map(({ text, total, icon, route }) => {
              return (
                <div className="px-3 col-lg-3 col-6">
                  <Link to={`${route}`}>
                    <div className="dashboard-right-side-top-card my-lg-3 w-100 box-shadow-hover d-flex pl-1 py-3">
                      <div className="px-3 w-100 ">
                        <div className="d-flex justify-content-between  text-center align-items-center ">
                          <div className="dashboard_icon">{icon}</div>
                          <div className=" m-0 p-0  dashboard-left-icon-top-text1 text-right">
                            <div>{total}</div>
                            <p className="card-text">{text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <SubscriptionChart />

        <div className="col-lg-12 pb-lg-5 mt-0 dashboardCom-scroller-appoinment ">
          <div className="appoinment  mb-5">
            <RankedUni />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCom;
