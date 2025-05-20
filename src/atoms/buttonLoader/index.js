import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

const ButtonLoader = () => {
  return (
    <>
      <LoadingOutlined
        style={{
          fontSize: 24,
        }}
        spin
      />
    </>
  );
};

export default ButtonLoader;
