import React from "react";
import { Select } from "antd";

const { Option } = Select;

const CustomDropDown = ({
  mode,
  value,
  selectLabel = "Select",
  option = [],
  handleChangeSelect,
  disabled,
  name,
  field,
  hospitalDopDown,
  dayId,
}) => {
  // console.log(option, "current -->");
  const selectAllOption = { value: "all", label: "Select All" };
  const updatedOptions =
    mode === "multiple" ? [selectAllOption, ...option] : option;

  // useEffect(()=>{
  //   setTimeout(() => {
  //     handleSelectZero()
  //   }, 1);
  // },[])

  // const handleSelectZero = () => {
  //   const allOptions = [];
  //   handleChangeSelect(allOptions, name);
  // };

  const handleSelectAll = () => {
    const allOptions = option.map((item) => item.value);
    handleChangeSelect(allOptions, name);
  };

  const handleSelectChange = (val) => {
    if (Array.isArray(val) && val.includes("all")) {
      handleSelectAll();
    } else {
      handleChangeSelect(val, name);
      if (typeof hospitalDopDown === "function") {
        hospitalDopDown(val, dayId);
      }
    }
  };

  const renderOptions = updatedOptions?.map((opt) => {
    if (opt && opt.label) {
      return (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      );
    }
    return null;
  });

  return (
    <div>
      <Select
        defaultValue={mode === "multiple" ? value : selectLabel}
        className="custom-dropDown"
        name={name}
        mode={mode}
        // value={value || undefined}
        value={value || ""}
        showSearch={false}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children &&
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        disabled={disabled}
        field={field}
        allowClear={false}
        placeholder={mode && selectLabel}
        style={{
          width: "100%",
          height: "44px",
        }}
        onChange={handleSelectChange}
        rules={{
          required: {
            value: true,
            message: "Please select at least one",
          },
        }}
      >
        {/* {mode === "multiple" && (
          <Option key={selectAllOption.value} value={selectAllOption.value}>
            {selectAllOption.label}
          </Option>
        )} */}
        {renderOptions}
      </Select>
    </div>
  );
};

export default CustomDropDown;
