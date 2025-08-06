import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostSvg, UserSvg, EventSvg, ParcelSvg } from "../../assets/icons";
import ParcelsChart from './dispatchedparcelschart/ParcelsChart';
import ReportParcels from './reportdetails/ReportParcels';
import Loading from '../../components/common/Loading';
import "./dashboard.scss";
import "../../assets/css/dashboard.scss";
import { getAdminDashboard } from '../../services/wepickApi';

const DashboardCom = () => {
  const [cardData, setCardData] = useState({
    retailerCount: 0,
    customerCount: 0,
    parcelCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const handlegetData = async () => {
    try {
      setIsLoading(true);
      const response = await getAdminDashboard();
      const data = response?.data || {};
      setCardData({
        retailerCount: data.retailerCount || 0,
        customerCount: data.customerCount || 0,
        parcelCount: data.parcelCount || 0,
      });
    } catch (error) {
      // Handle error silently
    } finally {
      setIsLoading(false);
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setInitialLoadComplete(true);
      }, 500);
    }
  };

  useEffect(() => {
    handlegetData();
  }, []);

  const data1 = [
    {
      id: 1,
      text: "Total Retailers",
      total: cardData?.retailerCount || 0,
      icon: UserSvg,
      route: "/users",
    },
    {
      id: 2,
      text: "Total Customers",
      total: cardData?.customerCount || 0,
      icon: UserSvg,
      route: "/allpost",
    },
    {
      id: 3,
      text: "Total Parcels",
      total: cardData?.parcelCount || 0,
      icon: ParcelSvg,
      route: "/parcels",
    },
    
  ];

  const [dropdownValueChange, setDropdownValueChange] = useState("");

  const handleChangeSelect = (value) => {
    setDropdownValueChange(value);
  };

  return (
    <>
      {isLoading || !initialLoadComplete ? (
        <Loading />
      ) : (
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
      )}
    </>
  );
};

export default DashboardCom;
