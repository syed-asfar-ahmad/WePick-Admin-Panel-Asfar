import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
const PageLoader = () => {
  return (
    <div className="loader-overlay">
      <LoadingOutlined style={{ fontSize: "4rem", color: "#4fa6d1" }} spin />
    </div>
  );
};

export default PageLoader;
