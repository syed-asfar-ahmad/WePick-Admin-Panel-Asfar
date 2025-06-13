import React, { useState } from "react";
import crossIcon from "../../assets/images/Frame 48.png";
import { Upload } from "antd";
import { postRequest } from "../../services/api";
import ButtonLoader from "../buttonLoader";
import { toast } from "react-toastify";

export const uploadimage = (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M42.2891 67.1625V52.2375H52.2391L39.8016 37.3125L27.3641 52.2375H37.3141V67.1625H24.8766V67.0382C24.4587 67.063 24.0607 67.1625 23.6328 67.1625C18.6849 67.1625 13.9396 65.197 10.4409 61.6983C6.94213 58.1995 4.97656 53.4542 4.97656 48.5063C4.97656 38.9344 12.2152 31.1336 21.5035 30.064C22.3179 25.8068 24.5903 21.9665 27.9298 19.2036C31.2693 16.4406 35.4672 14.9277 39.8016 14.925C44.1365 14.9274 48.3352 16.4402 51.6755 19.2031C55.0159 21.966 57.2892 25.8064 58.1046 30.064C67.3929 31.1336 74.6216 38.9344 74.6216 48.5063C74.6216 53.4542 72.656 58.1995 69.1573 61.6983C65.6586 65.197 60.9133 67.1625 55.9653 67.1625C55.5474 67.1625 55.1445 67.063 54.7216 67.0382V67.1625H42.2891Z"
      fill="#999999"
    />
  </svg>
);

const UploadImageModal = ({ showModal, handleClose, onFileUpload, setFilterState }) => {

  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async ({ file }) => {

    setFile(file);
    setIsLoading(true);

    const formData = new FormData();
    formData?.append('requestId', showModal);
    formData?.append('receiptFile', file);
    formData?.append('status', 'completed');
    
  };

  const truncateFileName = (name, maxLength = 5) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + "...png";
    }
    return name;
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={!isLoading ? handleClose : undefined}>
      <div
        className="modal-dialog modal-confirm"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content py-4" style={{ fontFamily: 'Montserrat', borderRadius: '14px' }}>
          <img
            src={crossIcon}
            alt="crossIcon"
            className="cross-image"
            onClick={!isLoading ? handleClose : undefined}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p
              className="text-center modal-heading"
              style={{
                color: "#00000",
                fontSize: "30px",
                fontWeight: "600",
                paddingBottom: "10px",
              }}
            >
              Upload Receipt's Image
            </p>
            <div
              className="modal-sub mb-4"
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <p 
                style={{
                  color: "#999999",
                  fontSize: "16px",
                  fontWeight: "400"
                }}
              >To approve the request, you must upload a</p>
              <p
                style={{
                  color: "#999999",
                  fontSize: "16px",
                  fontWeight: "400",
                }}
              >screenshot of the receipt</p>
            </div>
            {isLoading ? <ButtonLoader /> : 
              <Upload
                onChange={handleUpload}
                beforeUpload={() => false} // Prevent auto-upload
                accept=".pdf,.jpg,.jpeg,.png"
                showUploadList={false} // Disable file name display
                maxCount={1} // Allow only a single file upload
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {uploadimage}{" "}
                  </p>
                  <p
                    style={{
                      textAlign: "center",
                      color: "#BEBEBE",
                      fontSize: "16px",
                      fontWeight: "400",
                      fontFamily: 'Montserrat'
                    }}
                  >
                    Upload Image
                  </p>
                </div>
              </Upload>
            }
            {file && (
              <p style={{ textAlign: "center", marginTop: "10px" }}>
                {truncateFileName(file?.name)}
              </p>
            )}
            <p 
              style={{
                textAlign: "center",
                color: "#BEBEBE",
                fontSize: "12px",
                fontWeight: "400"
              }}
            >
              Supported formats PDF, JPEG & PNG
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImageModal;
