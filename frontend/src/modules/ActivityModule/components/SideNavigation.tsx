import {
    FileFilled,
    FundFilled,
    HeartFilled,
    ThunderboltFilled,
    ClockCircleFilled,
} from "@ant-design/icons";
import { Button, Tabs, Tooltip } from "antd";
import type { Activity } from "@/types/Activity";
import { useState } from "react";
import SummaryTab from "../tabs/SummaryTab";
import HrTab from "../tabs/HrTab";
import PowerTab from "../tabs/PowerTab";
import MapAndGraphTab from "../tabs/MapAndGraphTab";

interface SideMenuProps {
    item: Activity;
    isFullscreen: boolean;
}

const SideNavigation = ({ item, isFullscreen }: SideMenuProps) => {
    const [activeTab, setActiveTab] = useState("1");

    const tabConfigs = [
        {
            key: "1",
            title: "Summary",
            icon: <FileFilled />,
            content: <SummaryTab item={item} />,
        },
        {
            key: "2",
            title: "Map and Graph",
            icon: <FundFilled />,
            content: <MapAndGraphTab item={item} />,
        },
        {
            key: "3",
            title: "Heart Rate",
            icon: <HeartFilled />,
            content: <HrTab item={item} isFullscreen={isFullscreen} />,
        },
        {
            key: "4",
            title: "Power",
            icon: <ThunderboltFilled />,
            content: <PowerTab item={item} isFullscreen={isFullscreen} />,
        },
        {
            key: "5",
            title: "Speed",
            icon: <ClockCircleFilled />,
            content: <div>Prędkość</div>,
        },
    ];

    const tabItems = tabConfigs.map((tab) => ({
        key: tab.key,
        label: (
            <Tooltip title={tab.title} placement="right">
                <Button type={activeTab === tab.key ? "link" : "text"}>
                    {tab.icon}
                </Button>
            </Tooltip>
        ),
        children: tab.content,
    }));

    return (
        <Tabs
            defaultActiveKey="1"
            tabPlacement="start"
            onChange={(key) => setActiveTab(key)}
            items={tabItems}
            styles={{
                root: {
                    height: "100%",
                },
                item: {
                    padding: 0,
                },
                content: {
                    height: "100%",
                    maxHeight: "60vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                    paddingRight: "8px",
                    margin: "16px 0",
                },
            }}
        />
    );
};

export default SideNavigation;
