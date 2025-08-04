import React, { useMemo, useState } from "react";
import { Country, State } from "country-state-city";
import CustomDropDown from "../CustomDropDown/Index";

const SelectState = ({ value, handleChange, country, name, disabled = false, req }) => {
  const [disabledState, setDisabledState] = useState(false)
  const Countries = Country.getAllCountries();
  const selectedCountry = () => {
    const res = Countries.find((val) => val.name === country);
    return res;
  };
  const stat = useMemo(() => selectedCountry(), [country]);
  const States = useMemo(() => State.getStatesOfCountry(stat?.isoCode), [stat]);

  const Cont = () => {
    const res = States.map((val) => ({
      label: val.name,
      value: val.name,
    }));

    return res;
  };

  const option = useMemo(() => Cont(), [stat]);
  return (
    <>
      <div class="">
        <p className=" doc-add-filter-text">State{req === true ?<span className="text-danger">*</span> : null}</p>
        <CustomDropDown
          option={option}
          handleChangeSelect={(val) => handleChange(val, name)}
          value={value}
          disabled={option?.length <1 || disabled}
        />
      </div>
    </>
  );
};

export default SelectState;
