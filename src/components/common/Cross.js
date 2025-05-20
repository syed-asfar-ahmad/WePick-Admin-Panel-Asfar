import crossVector from "../../assets/images/common/cross.svg";
import "../../assets/css/common/common.scss";

const Cross = ({ onCross }) => {
  return (
    <div className="cross-icon" onClick={onCross}>
      <img src={crossVector} width="10px" />
    </div>
  );
};

export default Cross;
