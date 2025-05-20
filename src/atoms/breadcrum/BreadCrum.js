import React from "react";
import Chevron from "../../assets/images/common/chevron-right.svg";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/blooddonation.scss";
const BreadCrum = ({
  firstText,
  firstLink,
  secondLink,
  secondText,
  thirdText,
  breadCrumbItems
}) => {

  const navigate = useNavigate();
  
  return (

    <p className="blooddonation-breadcrumb">

      {breadCrumbItems ? 

        breadCrumbItems?.map((item, index) => {
          return <>
            {index !== 0 && <img src={Chevron} alt="" />}
            <span 
              className={`${index === breadCrumbItems?.length - 1 && 'current-tab'}`}
              onClick={() => {
                if(item?.href){
                  navigate(item?.href);
                }
              }}
              style={{ cursor: index !== breadCrumbItems?.length - 1 && 'pointer', color: index !== breadCrumbItems?.length - 1 && '#999999' }}
            > {item?.title}</span>
          </>
        })

        :

        <>

          <Link to="/">
            <span>Dashboard</span>
          </Link>
          {firstLink && (
            <>
              <img src={Chevron} alt="" />
              <Link to={firstLink}>
                {/* <span className={!secondText && "current-tab"}> {firstText}</span> */}
                <span className={!secondText && "current-tab"}> {firstText}</span>
              </Link>
            </>
          )}
          {secondText && (
            <>
              <img src={Chevron} alt="" />
              <Link to={secondLink}>
                <span
                  className={!thirdText && "current-tab"}
                  style={{ height: "100px" }}
                >
                  {secondText}
                </span>
              </Link>
            </>
          )}
          {thirdText && (
            <>
              <img src={Chevron} alt="" />
              {/* <Link to={thirdLink}>
              </Link> */}
              <span className="current-tab" style={{ height: "100px" }}>
                {thirdText}
              </span>
            </>
          )}
        </>
      }
    </p>
  );
};

export default BreadCrum;
