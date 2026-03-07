import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Layout,
    Menu,
    Avatar,
    Dropdown,
    ConfigProvider,
    Button,
    Space,
    Badge,
    Tooltip,
} from "antd";
import type { MenuProps } from "antd";
import {
    LogoutOutlined,
    UserOutlined,
    BellOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
} from "@ant-design/icons";
import logo from "@/style/images/logo-light.svg";
import useAuth from "@/hooks/useAuth";
import { useLogoutMutation } from "@/store";
import type { UserState } from "@/store/auth/authSlice";

const { Header } = Layout;

const navItems: MenuProps["items"] = [
    { key: "home", label: "Home" },
    { key: "calendar", label: "Calendar" },
    { key: "dashboard", label: "Dashboard" },
];

const ProfileDropdown = ({
    user,
    className,
}: {
    user: UserState | null;
    className: string;
}) => {
    const navigate = useNavigate();

    return (
        <div
            className={`profileDropdown ${className}`}
            onClick={() => navigate("/profile")}
        >
            <Avatar
                size="large"
                className="last"
                style={{
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                    boxShadow: "rgba(150, 190, 238, 0.35) 0px 0px 6px 1px",
                }}
            >
                {user?.firstName?.charAt(0).toUpperCase()}
            </Avatar>
            <div className="profileDropdownInfo">
                <p>
                    {user?.firstName} {user?.lastName}
                </p>
                <p>{user?.email}</p>
            </div>
        </div>
    );
};

const HeaderContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { user } = useAuth();
    const [logout] = useLogoutMutation();

    const currentLocation = location.pathname.split("/").pop();

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Błąd przy włączaniu fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFsChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFsChange);
        return () =>
            document.removeEventListener("fullscreenchange", handleFsChange);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const DropdownMenu = ({ text, ...rest }: { text?: string }) => {
        return (
            <span style={{}} {...rest}>
                {text}
            </span>
        );
    };

    const profileItems: MenuProps["items"] = [
        {
            label: (
                <ProfileDropdown user={user} className="headerDropDownMenu" />
            ),
            key: "ProfileDropdown",
        },
        {
            type: "divider",
        },
        {
            icon: <UserOutlined />,
            key: "settingProfile",
            label: (
                <Link to={"/profile"}>
                    <DropdownMenu text={"Settings"} />
                </Link>
            ),
        },
        {
            type: "divider",
        },
        {
            icon: <LogoutOutlined />,
            key: "logout",
            label: <div onClick={handleLogout}>Logout</div>,
        },
    ];

    const notificationItems: MenuProps["items"] = [
        { key: "1", label: "Notifications", type: "group" },
        { type: "divider" },
        ...Array.from({ length: 5 }, (_, i) => [
            {
                key: `notification-${i + 1}`,
                label: (
                    <div className="p-1">
                        <p className="m-0 font-medium">Notification {i + 1}</p>
                        <p className="m-0 text-sm text-gray-500">
                            2 minutes left
                        </p>
                    </div>
                ),
            },
        ]).flat(),
    ];

    return (
        <Header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 999,
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
                    defaultSelectedKeys={
                        currentLocation ? [currentLocation] : ["home"]
                    }
                    onSelect={({ key }) => navigate(key === "home" ? "/" : key)}
                    items={navItems}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        background: "#010F31",
                        justifyContent: "center",
                        lineHeight: "46px",
                    }}
                />
            </ConfigProvider>
            <Space wrap>
                <Dropdown
                    menu={{ items: profileItems }}
                    trigger={["click"]}
                    placement="bottomRight"
                >
                    <Avatar
                        className="last"
                        style={{
                            color: "#FFF",
                            backgroundColor: "#BDBDBD",
                            boxShadow:
                                "rgba(150, 190, 238, 0.35) 0px 0px 10px 2px",
                            float: "right",
                            cursor: "pointer",
                        }}
                    >
                        {user?.firstName?.charAt(0).toUpperCase()}
                    </Avatar>
                </Dropdown>
                <Dropdown
                    menu={{ items: notificationItems }}
                    trigger={["click"]}
                    placement="bottomRight"
                    styles={{
                        root: {
                            minWidth: "220px",
                        },
                    }}
                >
                    <Tooltip title="See Notifications">
                        <Badge
                            dot
                            offset={[-8, 8]}
                            color="blue"
                            style={{
                                boxShadow: "0 0 0 1px #010F31",
                            }}
                        >
                            <Button
                                icon={<BellOutlined />}
                                shape="circle"
                                type="text"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#FFF",
                                }}
                                size="large"
                            />
                        </Badge>
                    </Tooltip>
                </Dropdown>
                <Tooltip title="Toggle Fullscreen">
                    <Button
                        icon={
                            isFullscreen ? (
                                <FullscreenExitOutlined />
                            ) : (
                                <FullscreenOutlined />
                            )
                        }
                        onClick={toggleFullscreen}
                        shape="circle"
                        type="text"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FFF",
                        }}
                        size="large"
                    />
                </Tooltip>
            </Space>
        </Header>
    );
};

export default HeaderContent;
