import {
    FileFilled,
    FundFilled,
    HeartFilled,
    ThunderboltFilled,
    ClockCircleFilled,
} from "@ant-design/icons";
import { Button, Menu, Tabs, Tooltip } from "antd";
import type { pageType } from ".";
import SummaryTab from "./SummaryTab";
import type { Activity } from "@/types/Activity";

interface SideMenuProps {
    item: Activity;
    handlePageChange: (key: pageType) => void;
}

const SideMenu = ({ item, handlePageChange }: SideMenuProps) => {
    return (
        // <Menu
        //     mode="inline"
        //     defaultSelectedKeys={["1"]}
        //     inlineCollapsed
        //     items={[
        //         {
        //             key: "1",
        //             icon: <FileFilled />,
        //             label: "Summary",
        //         },
        //         {
        //             key: "2",
        //             icon: <FundFilled />,
        //             label: "Map and Graph",
        //         },
        //         {
        //             key: "3",
        //             icon: <HeartFilled />,
        //             label: "Heart Rate",
        //         },
        //         {
        //             key: "4",
        //             icon: <ThunderboltFilled />,
        //             label: "Power",
        //         },
        //         {
        //             key: "5",
        //             icon: <ClockCircleFilled />,
        //             label: "Speed",
        //         },
        //     ]}
        // />
        <Tabs
            defaultActiveKey="1"
            tabPlacement="start"
            items={[
                {
                    key: "1",
                    label: (
                        <Tooltip title="Summary" placement="right">
                            <Button type="text">
                                <FileFilled />
                            </Button>
                        </Tooltip>
                    ),
                    children: <SummaryTab item={item} />,
                },
                {
                    key: "2",
                    label: (
                        <Tooltip title="Map and Graph" placement="right">
                            <Button type="text">
                                <FundFilled />
                            </Button>
                        </Tooltip>
                    ),
                },
                {
                    key: "3",
                    label: (
                        <Tooltip title="Heart Rate" placement="right">
                            <Button type="text">
                                <HeartFilled />
                            </Button>
                        </Tooltip>
                    ),
                },
                {
                    key: "4",
                    label: (
                        <Tooltip title="Power" placement="right">
                            <Button type="text">
                                <ThunderboltFilled />
                            </Button>
                        </Tooltip>
                    ),
                },
                {
                    key: "5",
                    label: (
                        <Tooltip title="Speed" placement="right">
                            <Button type="text">
                                <ClockCircleFilled />
                            </Button>
                        </Tooltip>
                    ),
                },
            ]}
            styles={{
                root: {
                    height: "100%",
                },
                item: {
                    padding: 0,
                },
            }}
        />
    );
};

export default SideMenu;
