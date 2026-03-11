import {
    FileFilled,
    FundFilled,
    HeartFilled,
    ThunderboltFilled,
    ClockCircleFilled,
} from "@ant-design/icons";
import { Menu } from "antd";
import type { pageType } from ".";

interface SideMenuProps {
    handlePageChange: (key: pageType) => void;
}

const SideMenu = ({ handlePageChange }: SideMenuProps) => {
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            inlineCollapsed
            items={[
                {
                    key: "1",
                    icon: <FileFilled />,
                    label: "Summary",
                },
                {
                    key: "2",
                    icon: <FundFilled />,
                    label: "Map and Graph",
                },
                {
                    key: "3",
                    icon: <HeartFilled />,
                    label: "Heart Rate",
                },
                {
                    key: "4",
                    icon: <ThunderboltFilled />,
                    label: "Power",
                },
                {
                    key: "5",
                    icon: <ClockCircleFilled />,
                    label: "Speed",
                },
            ]}
        />
    );
};

export default SideMenu;
