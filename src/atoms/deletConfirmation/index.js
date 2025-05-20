import React from 'react'
import ButtonLoader from '../buttonLoader'
import { Modal } from 'antd'

const DeletConfirmation = ({handleDelete,deleteModal,setDeleteModal,isLoading}) => {
  return (
    <Modal
    className="doctor-filter-modal"
    centered
    open={deleteModal}
    // onOk={() => setModal2Open(false)}
    onCancel={() => setDeleteModal(false)}
    width={514}
    footer={null}
    closable={false}
  >
    <div className="row pb-1">
      <div className="col-12 d-flex flex-column align-items-center justify-content-center pharmacy-delete">
        <p className="mb-0 pt-lg-5 pt-3 pb-4 mt-lg-3">
          Are you sure you want to delete?
        </p>
        <button
          className="mt-lg-4 mt-1 mb-lg-5 mb-2"
          disabled={isLoading}
          onClick={() => handleDelete()}
        >
          {" "}
          {!isLoading ? "Delete" : <ButtonLoader />}
        </button>
      </div>
    </div>
  </Modal>
  )
}

export default DeletConfirmation