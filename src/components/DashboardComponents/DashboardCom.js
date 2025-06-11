import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  getDashCount, 
  getDashCommunity, 
  getParcelSummary, 
  getParcelReport,
  getReportStats,
  getWithdrawalRequests 
} from "../../services/service";
import { PostSvg, UserSvg, EventSvg, LockerSvg, ParcelSvg } from "../../assets/icons";

// Components
import ParcelsChart from "./wepick/ParcelsChart";
import ReportParcels from "./wepick/ReportParcels";

// Styles
import "./dashboard.scss";
import "../../assets/css/dashboard.scss";

const DashboardCom = () => {
  const [cardData, setCardData] = useState({
    userCount: 0,
    postCount: 0,
    eventCount: 0,
    withdrawRequestCount: 0
  });
  const [communityData, setCommunityData] = useState([]);
  const [reportStats, setReportStats] = useState({});
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handlegetData = async () => {
    try {
      setIsLoading(true);
      // Get dashboard counts
      const dashCountResponse = await getDashCount();
      if (dashCountResponse?.success) {
        setCardData(dashCountResponse?.data || {
          userCount: 0,
          postCount: 0,
          eventCount: 0,
          withdrawRequestCount: 0
        });
      }

      // Get community data
      const communityResponse = await getDashCommunity();
      if (communityResponse?.success) {
        setCommunityData(communityResponse?.data || []);
      }

      // Get report statistics
      const reportStatsResponse = await getReportStats();
      if (reportStatsResponse?.success) {
        setReportStats(reportStatsResponse?.data || {});
      }

      // Get withdrawal requests
      const withdrawalResponse = await getWithdrawalRequests(1, 10, '');
      if (withdrawalResponse?.success) {
        setWithdrawalRequests(withdrawalResponse?.data || []);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handlegetData();
  }, []);

  const data1 = [
    {
      id: 1,
      text: "Total Retailers",
      total: cardData?.userCount || 0,
      icon: UserSvg,
      route: "/users",
    },
    {
      id: 2,
      text: "Total Customers",
      total: cardData?.postCount || 0,
      icon: UserSvg,
      route: "/allpost",
    },
    {
      id: 3,
      text: "Total Parcels",
      total: cardData?.eventCount || 0,
      icon: ParcelSvg,
      route: "/parcels",
    },
    {
      id: 4,
      text: "Locker availability",
      total: cardData?.withdrawRequestCount || 0,
      icon: LockerSvg,
      route: "/withdrawalrequests",
    },
  ];

  const [dropdownValueChange, setDropdownValueChange] = useState("");

  const handleChangeSelect = (value) => {
    setDropdownValueChange(value);
  };

  return (
    <>
      <div className="row px-2 pt-4" style={{ overflowX: "hidden" }}>
        <div className="col-12 mt-1">
          <div className="row">
            {data1.map(({ text, total, icon }) => {
              return (
                <div key={text} className="px-3 col-lg-3 col-6">
                  <div className="dashboard-right-side-top-card my-lg-3 w-100 box-shadow-hover d-flex pl-1 py-3">
                    <div className="px-3 w-100 ">
                      <div className="d-flex justify-content-between text-center align-items-center ">
                        <div className="dashboard_icon">{icon}</div>
                        <div className="m-0 p-0 dashboard-left-icon-top-text1 text-right">
                          <div>{total}</div>
                          <p className="card-text">{text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ParcelsChart />

        <div className="col-lg-12 pb-lg-5 mt-0 dashboardCom-scroller-appoinment ">
          <div className="appoinment mb-5">
            <ReportParcels />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCom;
