import React from "react";
import { Col, Flex, Input, Row } from "antd";
import dayjs from "dayjs";
import type { Activity } from "@/types/Activity";

interface ActivityModalContentProps {
    item: Activity;
}

interface StatsProps {
    stats: {
        label: string;
        value: string | number;
        unit: string;
        isBlue?: boolean;
    }[];
    header: string[];
}

const SummaryTableItem = ({ stats, header }: StatsProps) => {
    return (
        <div>
            <Row gutter={12} align="middle" style={{ marginBottom: "8px" }}>
                <Col span={8}></Col>
                {header.map((label, index) => (
                    <Col
                        span={7}
                        key={index}
                        className="text-center text-xs font-medium text-gray-600"
                    >
                        {label}
                    </Col>
                ))}
                <Col span={2}></Col>
            </Row>
            {stats.map((stat, index) => (
                <Row
                    key={index}
                    gutter={12}
                    align="middle"
                    style={{ marginBottom: "8px" }}
                >
                    <Col span={8} style={{ textAlign: "right" }}>
                        <span
                            style={{
                                fontSize: "13px",
                                color: stat.isBlue ? "#1677ff" : "#333",
                                textDecoration: stat.isBlue
                                    ? "underline dashed 1px"
                                    : "none",
                                textUnderlineOffset: "4px",
                            }}
                        >
                            {stat.label}
                        </span>
                    </Col>
                    <Col span={7}>
                        <Input
                            size="small"
                            style={{ textAlign: "center", width: "100%" }}
                        />
                    </Col>
                    <Col span={7}>
                        <Input
                            size="small"
                            readOnly
                            value={stat.value}
                            style={{
                                textAlign: "center",
                                width: "100%",
                                backgroundColor: "#fafafa",
                                color: "#333",
                            }}
                        />
                    </Col>
                    <Col
                        span={2}
                        style={{
                            fontSize: "13px",
                            color: "#666",
                            textWrap: "nowrap",
                        }}
                    >
                        {stat.unit}
                    </Col>
                </Row>
            ))}
        </div>
    );
};

const ActivityModalContent = ({ item }: ActivityModalContentProps) => {
    const summaryStats: StatsProps["stats"] = [
        {
            label: "Duration",
            value: dayjs
                .duration(item.durationSec, "seconds")
                .format("HH:mm:ss"),
            unit: "h:m:s",
            isBlue: true,
        },
        {
            label: "Distance",
            value: (item.distanceMeters / 1000).toFixed(1),
            unit: "km",
            isBlue: true,
        },
        { label: "Average Speed", value: item.summary.avgSpeed, unit: "kph" },
        { label: "Calories", value: item.summary.calories, unit: "kcal" },
        {
            label: "Elevation Gain",
            value: item.summary.elevationGain,
            unit: "m",
        },
        { label: "TSS", value: item.summary.tss, unit: "TSS", isBlue: true },
        { label: "IF", value: item.summary.if, unit: "IF" },
        { label: "Normalized Power", value: item.summary.np, unit: "W" },
        { label: "Work", value: item.summary.workKj, unit: "kJ" },
    ];

    const performanceStats: StatsProps["stats"] = [
        { label: "Heart Rate", value: item.summary.avgHr, unit: "bpm" },
    ];

    return (
        <Flex vertical gap={30} style={{ maxWidth: "420px", margin: "16px 0" }}>
            <SummaryTableItem
                stats={summaryStats}
                header={["Planned", "Completed"]}
            />
            {/* <SummaryTableItem stats={stats} header={["Avg", "Max"]} /> */}
        </Flex>
    );
};

export default ActivityModalContent;
