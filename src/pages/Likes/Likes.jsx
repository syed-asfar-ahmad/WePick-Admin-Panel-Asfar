import React, { useEffect, useState } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import "./likes.scss";
// import FilterModal from "./FilterModal";
import { useParams } from "react-router-dom";
import { userLikes } from "../../services/service";
import { FaArrowLeft } from "react-icons/fa6";
import NoDataFound from "../../atoms/NodataFound";
import { Box, CircularProgress } from "@mui/material";
import PageLoader from "../../components/common/PageLoader";

const Likes = () => {
  //   const [visible, setVisible] = useState(false);
  const { id } = useParams();
  const [getUserLikes, setUserLikes] = useState([]);
  const [showdata, setShowData] = useState("yearly");
  const [selectedYear, setSelectedYear] = useState(null);
  const [loader, setLoader] = useState(false);

  //   const togglePopup = () => {
  //     setVisible(!visible);
  //   };

  const handlegetUserLikesData = async () => {
    setLoader(true);
    try {
      const response = await userLikes(id, showdata);
      if (response) {
        setUserLikes(response?.data);
        console.log("response", response?.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    handlegetUserLikesData();
  }, [showdata]);

  const getUserMontlyData = getUserLikes?.map((item) => ({
    year: item.year,
    month: item.month?.map((monthItem) => ({
      name: monthItem.name,
      likes: monthItem.likes,
    })),
  }));

  const handleChangeYearData = (year) => {
    setSelectedYear(year);
    setShowData(showdata == "monthly" ? "yearly" : "monthly");
  };
  const handleBackToYearly = () => {
    setSelectedYear(null);
    setShowData("yearly");
    handlegetUserLikesData("yearly");
  };

  //loading

  if (loader) {
    return (
      <PageLoader />
    );
  }

  return (
    <div className="col-12">
      <ListHeader
        mainHeading="Likes"
        placeholder="Search user by name, email, university or Course"
        linkBreadCrum="/users"
        blinkBreadCrumText="Users"
        blinkBreadCrumText1="Likes"
        handleSearchChange={() => console.log("hello")}
        searchShow={false}
      // showLikeFilter={true}
      // onShowLikeFilterClick={togglePopup} // Pass the handler function
      />
      {getUserLikes?.length === 0 ? (
        <div
          className="mt-4 px-3 py-3 bg-white row flex-column mb-3 text-center"
          style={{ borderRadius: "30px" }}
        >
          <NoDataFound />
        </div>
      ) : (
        <div
          className="mt-4 px-3 py-3 bg-white row flex-column mb-3"
          style={{ borderRadius: "30px" }}
        >
          {showdata === "monthly" && (
            <div className="d-flex align-items-center my-3">
              <span className="mr-2 mb-1" onClick={handleBackToYearly}>
                <FaArrowLeft size={20} fill="#333" />
              </span>
              <span className="text-muted me-3 h2-custom ">{selectedYear}</span>
              <div className="flex-grow-1 pl-4">
                <hr />
              </div>
            </div>
          )}
          <table className="table-custom">
            <tbody>
              {showdata === "yearly" ? (
                <>
                  {getUserLikes?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td
                          className="px-0 month-name"
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => handleChangeYearData(data?.year)}
                        >
                          {data?.year}
                        </td>
                        <td className="px-0 amount">{data?.totalLikes}</td>
                      </tr>
                    );
                  })}
                </>
              ) : (
                <>
                  {getUserMontlyData?.map((yearItem, index) => (
                    <React.Fragment key={index}>
                      {yearItem?.month?.map((monthItem, monthIndex) => (
                        <tr key={`${index}-${monthIndex}`}>
                          <td className="px-0 month-name">{monthItem?.name}</td>
                          <td className="px-0 amount">{monthItem?.likes}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* {visible && <FilterModal visible={visible} setVisible={setVisible} />} */}
    </div>
  );
};

export default Likes;
