import { Flex, Form, Input, Rate, Select, Space } from "antd";
import dayjs from "dayjs";
import { SI } from "@/constants/activities";
import type { Activity } from "@/types/Activity";
import SummaryTable, { type TableRowData } from "@/components/SummaryTable";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import RpeSlider from "../components/RpeSlider";

const { TextArea } = Input;

interface ActivityModalContentProps {
    item: Activity;
}

const SummaryTab = ({ item }: ActivityModalContentProps) => {
    const summaryStatsConfig: TableRowData[] = [
        {
            key: "duration",
            cells: [
                { type: "text", value: "Duration" },
                { type: "input" },
                {
                    type: "readonly",
                    value: dayjs
                        .duration(item.durationSec, "seconds")
                        .format("HH:mm:ss"),
                },
                { type: "text", value: "h:m:s", unit: "true" },
            ],
        },
        {
            key: "distance",
            cells: [
                { type: "text", value: "Distance" },
                { type: "input" },
                {
                    type: "readonly",
                    value: (item.distanceMeters / 1000).toFixed(1),
                },
                { type: "text", value: "km", unit: "true" },
            ],
        },
        {
            key: "avgSpeed",
            cells: [
                { type: "text", value: "Average Speed" },
                { type: "input" },
                {
                    type: "readonly",
                    value: (
                        Math.floor(item.summary.avgSpeed * SI * 10) / 10
                    ).toFixed(1),
                },
                { type: "text", value: "kph", unit: "true" },
            ],
        },
        {
            key: "calories",
            cells: [
                { type: "text", value: "Calories" },
                { type: "input" },
                { type: "readonly", value: item.summary.calories },
                { type: "text", value: "kcal", unit: "true" },
            ],
        },
        {
            key: "elevation",
            cells: [
                { type: "text", value: "Elevation Gain" },
                { type: "input" },
                { type: "readonly", value: item.summary.elevationGain },
                { type: "text", value: "m", unit: "true" },
            ],
        },
        {
            key: "tss",
            cells: [
                { type: "text", value: "TSS" },
                { type: "input" },
                { type: "readonly", value: item.summary.tss },
                { type: "text", value: "TSS", unit: "true" },
            ],
        },
        {
            key: "if",
            cells: [
                { type: "text", value: "IF" },
                { type: "input" },
                { type: "readonly", value: item.summary.if },
                { type: "text", value: "IF", unit: "true" },
            ],
        },
        {
            key: "np",
            cells: [
                { type: "text", value: "Normalized Power" },
                { type: "disabled" },
                { type: "readonly", value: item.summary.np },
                { type: "text", value: "W", unit: "true" },
            ],
        },
        {
            key: "work",
            cells: [
                { type: "text", value: "Work" },
                { type: "input" },
                { type: "readonly", value: item.summary.workKj },
                { type: "text", value: "kJ", unit: "true" },
            ],
        },
    ];

    const hrPowerConfig: TableRowData[] = [
        {
            key: "heart_rate",
            cells: [
                { type: "text", value: "Heart Rate" },
                { type: "input" },
                { type: "readonly", value: item.summary.avgHr },
                { type: "readonly", value: item.summary.maxHr },
                { type: "text", value: "bpm", unit: "true" },
            ],
        },
        {
            key: "power",
            cells: [
                { type: "text", value: "Power" },
                { type: "disabled" },
                { type: "readonly", value: item.summary.avgPower },
                { type: "readonly", value: item.summary.maxPower },
                { type: "text", value: "W", unit: "true" },
            ],
        },
    ];

    const customIcons: Record<number, React.ReactNode> = {
        1: <FrownOutlined />,
        2: <FrownOutlined />,
        3: <MehOutlined />,
        4: <SmileOutlined />,
        5: <SmileOutlined />,
    };

    return (
        <Flex gap={40}>
            <Space style={{ flex: 1 }} size="large" vertical>
                <SummaryTable
                    header={["Planned", "Completed"]}
                    rows={summaryStatsConfig}
                />
                <SummaryTable
                    columnSpans={[8, 4, 5, 5, 1]}
                    header={["Min", "Avg", "Max"]}
                    rows={hrPowerConfig}
                />
                <span>Equipment</span>
                <Form name="equipment_form">
                    <Form.Item name="equipment" label="Bike">
                        <Select
                            style={{ width: 120 }}
                            options={[
                                { label: "Sensa", value: "1" },
                                { label: "Kross Vento", value: "2" },
                                { label: "Cube", value: "3" },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Space>
            <Form name="summary" layout="vertical" style={{ flex: 0.8 }}>
                <Form.Item name="description" label="Description">
                    <TextArea variant="filled" autoSize />
                </Form.Item>
                <Form.Item name="notes" label="Notes">
                    <TextArea
                        variant="filled"
                        maxLength={2000}
                        showCount
                        autoSize={{ minRows: 3 }}
                    />
                </Form.Item>
                <Form.Item
                    name={["rpe", "emojiScale"]}
                    label="How did you feel?"
                >
                    <Rate
                        character={({ index = 0 }) => customIcons[index + 1]}
                        size="large"
                    />
                </Form.Item>
                <Form.Item
                    name={["rpe", "value"]}
                    label={
                        <div className="text-nowrap">
                            Rating of Perceived Exertion (RPE)
                        </div>
                    }
                >
                    <RpeSlider />
                </Form.Item>
                <Form.Item name="tags" label="Tags">
                    <Select
                        mode="tags"
                        style={{ width: "100%" }}
                        options={[{ label: "Cycling", value: "cycling" }]}
                    />
                </Form.Item>
            </Form>
        </Flex>
    );
};

export default SummaryTab;
