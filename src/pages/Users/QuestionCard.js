import React from "react";
import { DeleteIcon } from "../../assets/icons";

const QuestionCard = ({ question, answer, onDelete }) => {
  return (
    <div
      className="card"
      style={{
        borderRadius: "15px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="d-flex justify-content-between align-items-center px-2 py-2">
        <div>
          <p className="mb-1">
            <strong
              className="d-inline-block"
              style={{ width: "3.5ch", color: "#0D0D0D", fontSize: "14px" }}
            >
              Q
            </strong>
            <span style={{ fontSize: "14px", color: "#999999" }}>
              {question}
            </span>
          </p>
          <p className="mb-0">
            <strong
              className="d-inline-block"
              style={{ width: "3.5ch", color: "#0D0D0D" }}
            >
              Ans.
            </strong>
            <span
              style={{ fontSize: "14px", color: "#999999", fontSize: "14px" }}
            >
              {answer}
            </span>
          </p>
        </div>
        <div onClick={onDelete}>{DeleteIcon}</div>
      </div>
    </div>
  );
};
export default QuestionCard;
