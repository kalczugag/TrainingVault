import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

const SideMenu = () => {
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            inlineCollapsed
            items={[
                {
                    key: "1",
                    icon: <UserOutlined />,
                    label: "nav 1",
                },
                {
                    key: "2",
                    icon: <VideoCameraOutlined />,
                    label: "nav 2",
                },
                {
                    key: "3",
                    icon: <UploadOutlined />,
                    label: "nav 3",
                },
            ]}
        />
    );
};

export default SideMenu;
