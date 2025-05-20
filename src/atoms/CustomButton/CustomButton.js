import React from "react";
import ButtonLoader from "../buttonLoader";

export default function CustomButton({
  text,
  backgroundColor,
  textColor,
  padding,
  marginLeft,
  onClick,
  border,
  loading,
  borderColor,
  marginTop,
  width,
  height
  //   type,
}) {
  return (
    <button
      type={"submit"}
      className="btn rounded-pill"
      style={{
        padding: padding,
        backgroundColor: backgroundColor,
        color: textColor,
        marginLeft: marginLeft,
        border: border,
        borderColor: borderColor,
        marginTop: marginTop,
        width: width || "115px",
        height: height || "37px",
      }}
      onClick={onClick}
    >
      {loading ? <ButtonLoader /> : text}
    </button>
  );
}
