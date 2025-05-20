import "../../assets/css/common/common.scss";
import { Select } from "antd";

const CustomSelect = ({ options, handleChange, value }) => {

  return (
    <Select
      value={value}
      size={"large"}
      onChange={handleChange}
      style={{ width: "100%" }}
      options={options}
    />
  );
};

export default CustomSelect;
