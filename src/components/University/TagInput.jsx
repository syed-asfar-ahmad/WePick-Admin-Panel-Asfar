import React from "react";
import plusIcon from "../../assets/images/university/plus icon.svg";
import "./university.scss";

const TagInput = ({
  name,
  tags,
  setTags,
  handleRemoveItem,
  tagInputValue,
  setTagInputValue,
  handleKeyDown,
  handleAddItem,
  placeholder,
  isView,
  id
}) => {
  return (
    <div className="course-input">
      <div className="course-input-inner">
        {tags.map((tag, index) => (
          <span key={index} className="course-tag">
            {tag}
            <button
              className="remove-course-button"
              onClick={() => handleRemoveItem(index, tags, setTags, name)}
            >
              x
            </button>
          </span>
        ))}
        <input
          type="text"
          value={tagInputValue}
          onChange={(e) => setTagInputValue(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDown(e, tagInputValue, setTagInputValue, tags, setTags, name)
          }
          placeholder={placeholder}
          className="course-name pl-2"
          disabled={!id}
        />
        {isView && (
          <img
            src={plusIcon}
            onClick={() =>
              handleAddItem(tagInputValue, setTagInputValue, tags, setTags, name)
            }
            alt="plus"
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
    </div>
  );
};

export default TagInput;
