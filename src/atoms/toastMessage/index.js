import { toast } from "react-toastify";
import "./toast.scss";

export const CustomToast = ({ type, message }) => {
  console.log("--type--", type);

  toast[type](
    <p className="ml-2" style={{ fontSize: 16 }}>
      {message}
    </p>,
    {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      className: "fullscreen-toast",
    }
  );
};
