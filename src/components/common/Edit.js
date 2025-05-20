import editVector from "../../assets/images/common/edit.svg";
import "../../assets/css/common/common.scss";

const Edit = ({ onEdit }) => {
  return (
    <div className="edit-icon" onClick={onEdit}>
      <img src={editVector} />
    </div>
  );
};

export default Edit;
