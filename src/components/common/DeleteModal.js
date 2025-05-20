import React from "react";
import { Modal } from "antd";
import "../../assets/css/common/common.scss";
import deleteIcon from "../../assets/images/common/delete.svg"

const DeleteModal = ({ open, onClose, onDelete }) => {
 
 const closeModal = () => {
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal
      className="delete-modal"
      open={open}
      onCancel={closeModal}
      centered
      closable={false}
      destroyOnClose={true}
      footer={null}
      zIndex={999}
    >
      <div className="modal-content-wrapper">
        <div className="cross-logo">
          <div className="cross-circle">
            <img src={deleteIcon} />
            </div>
        </div>
        <div className="heading">Delete Laboratory</div>
        <div className="description">
          Are you sure you want to delete this laboratory?
        </div>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
