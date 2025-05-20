import React from "react";
import "./university.scss";

const Suggestion = ({ title, data, handleAddItem }) => {
  return (
    <div className="course-suggestions mt-1">
      <p className="suggestions">{title}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        {data?.map((suggestion, index) => (
          <div
            key={index}
            className="suggestion-box"
            onClick={() => handleAddItem(suggestion.name)}
            style={{ cursor: "pointer" }}
          >
            <p className="suggestions-text">{suggestion.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestion;
