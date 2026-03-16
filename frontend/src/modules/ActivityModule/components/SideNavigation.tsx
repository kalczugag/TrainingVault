import {
    FileFilled,
    FundFilled,
    HeartFilled,
    ThunderboltFilled,
    ClockCircleFilled,
} from "@ant-design/icons";
import { Button, Tabs, Tooltip } from "antd";
import SummaryTab from "../tabs/SummaryTab";
import type { Activity } from "@/types/Activity";
import { useState } from "react";
import HrTab from "../tabs/HrTab";

interface SideMenuProps {
    item: Activity;
}

const SideNavigation = ({ item }: SideMenuProps) => {
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
            content: <div>Mapa</div>,
        },
        {
            key: "3",
            title: "Heart Rate",
            icon: <HeartFilled />,
            content: <HrTab item={item} />,
        },
        {
            key: "4",
            title: "Power",
            icon: <ThunderboltFilled />,
            content: <div>Moc</div>,
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
                    paddingRight: "8px",
                },
            }}
        />
    );
};

export default SideNavigation;
