import { Modal } from "antd";
import "../../assets/css/appointments/modal.scss";
import cross from "../../assets/images/common/cross.svg";

const CancelModal = ({ open, onClose , heading , description }) => {
  const closeModal = () => {
    onClose();
  };

  return (
    <>
      <Modal
        className="cross-modal"
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
              <img src={cross} />
            </div>
          </div>
          <div className="heading">
            {heading}
          </div>
          <div className="description">
          {description}
          </div>
          <button onClick={() => {}}>Cancel</button>
        </div>
      </Modal>
    </>
  );
};

export default CancelModal;
