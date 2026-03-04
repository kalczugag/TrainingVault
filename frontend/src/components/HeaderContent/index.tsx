import { Link, useNavigate } from "react-router-dom";
import {
    Layout,
    Menu,
    Avatar,
    Dropdown,
    Badge,
    Button,
    ConfigProvider,
} from "antd";
import { LogoutOutlined, ToolOutlined, UserOutlined } from "@ant-design/icons";
import logo from "@/style/images/logo-light.svg";

const { Header } = Layout;

const items = Array.from({ length: 3 }).map((_, index) => ({
    key: index + 1,
    label: `nav ${index + 1}`,
}));

const HeaderContent = () => {
    const PorfileDropdown = () => {};

    return (
        <Header
            style={{
                display: "flex",
                alignItems: "center",
                background: "#010F31",
                height: "46px",
            }}
        >
            <img src={logo} alt="logo" height={40} width={200} />
            <ConfigProvider
                theme={{
                    components: {
                        Menu: {
                            darkItemSelectedColor: "#FFF",
                            darkItemSelectedBg: "rgba(255,255,255,0.05)",
                            darkItemHoverColor: "#FFFFFF",
                            darkItemHoverBg: "rgba(255, 255, 255, 0.08)",
                        },
                    },
                }}
            >
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["1"]}
                    items={items}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        background: "#010F31",
                        justifyContent: "center",
                        lineHeight: "46px",
                    }}
                />
            </ConfigProvider>
        </Header>
    );
};

export default HeaderContent;
