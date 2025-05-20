import { Modal } from "antd";
import "../../assets/css/appointments/modal.scss";
import tick from "../../assets/images/common/tick.svg";

const AcceptModal = ({ open, onClose, onAccept, heading, description }) => {
  const closeModal = () => {
    onClose();
  };

  const handleAccept = () => {
    onAccept();
    // onClose();
  };

  return (
    <>
      <Modal
        className="accept-modal"
        open={open}
        centered
        onCancel={closeModal}
        closable={false}
        destroyOnClose={true}
        footer={null}
        zIndex={999}
      >
        <div className="modal-content-wrapper">
          <div className="tick-logo">
            <div className="tick-circle">
              <img src={tick} />
            </div>
          </div>
          <div className="heading">{heading}</div>
          <div className="description">{description}</div>
          <button onClick={handleAccept}>Accept</button>
        </div>
      </Modal>
    </>
  );
};

export default AcceptModal;
