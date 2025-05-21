import { Checkbox, ConfigProvider } from "antd";
import "../../assets/css/common/common.scss"

const CustomCheckbox = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1BC949',
        },
      }}
    >
      <Checkbox />
    </ConfigProvider>
  );
};

export default CustomCheckbox;
