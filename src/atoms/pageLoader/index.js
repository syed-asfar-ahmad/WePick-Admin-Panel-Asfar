import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const PageLoader = () => {
  return (
    <div className="loader-overlay">
      <CircularProgress 
        size={64} 
        sx={{ 
          color: '#4fa6d1'
        }} 
      />
    </div>
  );
};

export default PageLoader;
