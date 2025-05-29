import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

const ButtonLoader = () => {
  return (
    <>
      <CircularProgress
        size={24}
        sx={{
          color: 'primary.main'
        }}
      />
    </>
  );
};

export default ButtonLoader;
