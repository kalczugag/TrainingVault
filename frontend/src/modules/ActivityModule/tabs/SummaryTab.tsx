import {
    Divider,
    Flex,
    Form,
    Input,
    Rate,
    Select,
    Slider,
    Space,
    Tooltip,
    type RateProps,
} from "antd";
import dayjs from "dayjs";
import type { Activity } from "@/types/Activity";
import SummaryTable, {
    type SummaryTableProps,
} from "../components/SummaryTable";
import {
    FrownOutlined,
    InfoCircleOutlined,
    MehOutlined,
    SmileOutlined,
} from "@ant-design/icons";
import RpeSlider from "../components/RpeSlider";

const { TextArea } = Input;

interface ActivityModalContentProps {
    item: Activity;
}

const SummaryTab = ({ item }: ActivityModalContentProps) => {
    const summaryStats: SummaryTableProps["stats"] = [
        {
            label: "Duration",
            value: dayjs
                .duration(item.durationSec, "seconds")
                .format("HH:mm:ss"),
            unit: "h:m:s",
        },
        {
            label: "Distance",
            value: (item.distanceMeters / 1000).toFixed(1),
            unit: "km",
        },
        { label: "Average Speed", value: item.summary.avgSpeed, unit: "kph" },
        { label: "Calories", value: item.summary.calories, unit: "kcal" },
        {
            label: "Elevation Gain",
            value: item.summary.elevationGain,
            unit: "m",
        },
        { label: "TSS", value: item.summary.tss, unit: "TSS" },
        { label: "IF", value: item.summary.if, unit: "IF" },
        { label: "Normalized Power", value: item.summary.np, unit: "W" },
        { label: "Work", value: item.summary.workKj, unit: "kJ" },
    ];

    const customIcons: Record<number, React.ReactNode> = {
        1: <FrownOutlined />,
        2: <FrownOutlined />,
        3: <MehOutlined />,
        4: <SmileOutlined />,
        5: <SmileOutlined />,
    };

    return (
        <Flex gap={40} style={{ margin: "16px 0" }}>
            <Space style={{ flex: 1 }} size="large" vertical>
                <SummaryTable
                    stats={summaryStats}
                    header={["Planned", "Completed"]}
                />
                <span>Equipment</span>
                <Form name="equipment">
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
