// src/components/MyModal.js

import React from "react";
import { Modal } from "antd";
import { CalenderIcon } from "../../assets/icons";
import CustomButton from "../../atoms/CustomButton/CustomButton";
import { Radio, RadioGroup } from "@mui/material";

const FilterModal = ({ visible, setVisible }) => {
  return (
    <div>
      <Modal
        className="doctor-filter-modal"
        centered
        open={visible}
        onOk={() => setVisible(false)}
        width={514}
        footer={null}
        closable={false}
      >
        <div className="row pb-1">
          <h4
            className="w-100"
            style={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Choose Year & Month
          </h4>
          <div
            className="col-12 d-flex flex-column align-items-center justify-content-center"
            style={{ maxHeight: "24rem", overflowY: "auto" }}
          >
            <div className="w-100 d-flex align-items-center justify-content-between">
              <div>
                {" "}
                {CalenderIcon}{" "}
                <span className="filter-modal-text ">Yearly</span>
              </div>
              <RadioGroup>
                <Radio
                  value={false}
                  checked={false}
                  sx={{
                    "&.Mui-checked": {
                      color: "#0D0D0D",
                    },
                  }}
                />
              </RadioGroup>
            </div>
            <div className="w-100 d-flex align-items-center justify-content-between">
              <div>
                {" "}
                {CalenderIcon}{" "}
                <span className="filter-modal-text ">Monthly</span>
              </div>
              <RadioGroup>
                <Radio
                  value={false}
                  checked={false}
                  sx={{
                    "&.Mui-checked": {
                      color: "#0D0D0D",
                    },
                  }}
                />
              </RadioGroup>
            </div>
            <div className="filter-modal-text w-100 mt-4 mb-2">Select Year</div>
            <div className="w-100 d-flex align-items-center justify-content-between">
              <div>
                {" "}
                <span className="filter-modal-text ">2024</span>
              </div>
              <RadioGroup>
                <Radio
                  value={false}
                  checked={false}
                  sx={{
                    "&.Mui-checked": {
                      color: "#0D0D0D",
                    },
                  }}
                />
              </RadioGroup>
            </div>
            <div className="w-100 d-flex align-items-center justify-content-between">
              <div>
                {" "}
                <span className="filter-modal-text ">2023</span>
              </div>
              <RadioGroup>
                <Radio
                  value={false}
                  checked={false}
                  sx={{
                    "&.Mui-checked": {
                      color: "#0D0D0D",
                    },
                  }}
                />
              </RadioGroup>
            </div>
            <div className="w-100 d-flex align-items-center justify-content-between">
              <div>
                {" "}
                <span className="filter-modal-text ">2022</span>
              </div>
              <RadioGroup>
                <Radio
                  value={false}
                  checked={false}
                  sx={{
                    "&.Mui-checked": {
                      color: "#0D0D0D",
                    },
                  }}
                />
              </RadioGroup>
            </div>
          </div>
          <div className=" w-100 d-flex align-items-center justify-content-center">
            <CustomButton
              text={"Cancel"}
              backgroundColor={"#FFFFFF"}
              textColor={"#0D0D0D"}
              padding={"8px 5rem"}
              marginLeft={"0.5rem"}
              borderColor={"#0D0D0D"}
              onClick={() => setVisible(false)}
            />
            <CustomButton
              text={"Apply"}
              backgroundColor={"#0D0D0D"}
              textColor={"#FFFFFF"}
              padding={"8px 5rem"}
              marginLeft={"0.5rem"}
              onClick={() => setVisible(false)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FilterModal;
