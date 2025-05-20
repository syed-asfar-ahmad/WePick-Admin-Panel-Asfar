import deleteVector from "../../assets/images/common/delete.svg";
import "../../assets/css/common/common.scss";

const Delete = ({ onDelete }) => {
  return (
    <div className="delete-icon" onClick={onDelete}>
      <img src={deleteVector} width="10px" />
    </div>
  );
};

export default Delete;
