import React, { useState } from "react";
import "./eventHost.scss";
import { DeleteIcon } from "../../assets/icons";
import crossIcon from "../../assets/images/Frame 48.png";
import { toast } from "react-toastify";
import ConfirmationModal from "../ConfirmationModal";

const EventHostModal = ({ show, handleClose, data, hostedBy, getData }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [hostId, setHostId] = useState(null);

  if (!show) {
    return null;
  }
  const handleDeleteClick = () => {
    const payload = {
      eventId: data?.id,
      hostId: hostId,
    };
  };

  return (
    <>
      <ConfirmationModal
        show={deleteModal}
        handleClose={() => setDeleteModal(false)}
        handleConfirm={handleDeleteClick}
        loading={false}
        message={"Do you really want to delete this Host?"}
      />

      <div className="modal-overlay" onClick={handleClose}>
        <div
          className="modal-dialog modal-confirm"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="modal-content"
            style={{ borderRadius: "8px", padding: "20px" }}
          >
            <img
              src={crossIcon}
              alt="crossIcon"
              className="cross-image"
              onClick={handleClose}
            />
            <p className="text-center modal-heading">Hosts of the {hostedBy}</p>
            <div className="modal-sub">
              <div className="modal-data">
                <p className="table-heading">#</p>
                <p className="table-heading">Username</p>
                <p></p>
              </div>
            </div>
            <div className="table-cells">
              {data?.hosts?.length > 0 ? (
                data.hosts.map((host, index) => (
                  <div className="modal-sub" key={index}>
                    <div className="modal-data1">
                      <p>{index + 1}</p>
                      <p>{host?.userName}</p>
                      <div
                        style={{
                          paddingRight: "1rem",
                          marginTop: "-12px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setHostId(host?._id);
                          setDeleteModal(true);
                        }}
                      >
                        {DeleteIcon}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  No Hosts Found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventHostModal;
