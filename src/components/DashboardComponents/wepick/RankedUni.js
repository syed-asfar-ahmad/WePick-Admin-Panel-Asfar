import { useEffect, useState } from "react";
import { getDashCommunity } from "../../../services/service";

const RankedUni = () => {
  const [cardData, setCardData] = useState([]);
  const handlegetData = async () => {
    try {
      const response = await getDashCommunity();
      if (response?.success) {
        setCardData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching university data:", error);
    }
  };

  useEffect(() => {
    handlegetData();
  }, []);
  return (
    <>
      <div className="row  px-4 pt-3 my-2 ">
        <div className="col-12 d-flex justify-content-start align-items-center">
          <p className="mb-0  appoinment-text">Top Ranked Communities </p>
        </div>
      </div>

      <div
        className=" mx-2 -x-overflow-doc-list"
        id="scrollableDiv"
        style={{
          overflowX: "hidden",
          padding: "0 8px",
          marginTop: "2rem",
        }}
      >
        <div className="d-flex custom_between w-100 mb-2">
          <div className="pl-2 appoinment-detail-text ">Parcels</div>

          <div className="appoinment-detail-text text-center">
            Number of Customers
          </div>
          <div className=" pr-md-5 appoinment-detail-text text-right">Rank</div>
        </div>
        {cardData?.map((data, index) => {
          return (
            <div
              key={index}
              className={`d-flex custom_between w-100 py-2 ${index < 9 ? "border-bottom" : ""
                } `}
            >
              <div className="pl-2 appoinment-detail-text-5">
                {data?.communityName}
              </div>

              <div className="appoinment-detail-text-5 text-center">
                {data?.followerCount}
              </div>
              <div className="pr-md-5 appoinment-detail-text-5 text-right">
                {data?.currentRank}
              </div>
            </div>
          );
        })}

      </div>
    </>
  );
};
export default RankedUni;
