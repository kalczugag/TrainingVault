import { Flex, Form, Input, Rate, Select, Space } from "antd";
import type { TableRowData } from "@/components/SummaryTable";
import RpeSlider from "@/modules/ActivityModule/components/RpeSlider";
import SummaryTable from "@/components/SummaryTable";

const { TextArea } = Input;

interface PlanningTabProps {
    isFullscreen: boolean;
}

const PlanningTab = ({ isFullscreen }: PlanningTabProps) => {
    const form = Form.useFormInstance();

    const handleDistanceChange = (value: number | null) => {
        const distance = value || 0;
        const duration = form.getFieldValue("duration") || 0;
        const avgSpeed = form.getFieldValue("avgSpeed") || 0;

        if (distance > 0) {
            if (duration > 0) {
                form.setFieldValue(
                    "avgSpeed",
                    Number((distance / duration).toFixed(2)),
                );
            } else if (avgSpeed > 0) {
                form.setFieldValue(
                    "duration",
                    Number((distance / avgSpeed).toFixed(2)),
                );
            }
        }
    };

    const handleDurationChange = (value: number | null) => {
        const duration = value || 0;
        const distance = form.getFieldValue("distance") || 0;
        const avgSpeed = form.getFieldValue("avgSpeed") || 0;

        if (duration > 0) {
            if (distance > 0) {
                form.setFieldValue(
                    "avgSpeed",
                    Number((distance / duration).toFixed(2)),
                );
            } else if (avgSpeed > 0) {
                form.setFieldValue(
                    "distance",
                    Number((avgSpeed * duration).toFixed(2)),
                );
            }
        }
    };

    const handleSpeedChange = (value: number | null) => {
        const avgSpeed = value || 0;
        const distance = form.getFieldValue("distance") || 0;
        const duration = form.getFieldValue("duration") || 0;

        if (avgSpeed > 0) {
            if (duration > 0) {
                form.setFieldValue(
                    "distance",
                    Number((avgSpeed * duration).toFixed(2)),
                );
            } else if (distance > 0) {
                form.setFieldValue(
                    "duration",
                    Number((distance / avgSpeed).toFixed(2)),
                );
            }
        }
    };

    const summaryStatsConfig: TableRowData[] = [
        {
            key: "duration",
            cells: [
                {
                    type: "text",
                    value: "Duration",
                },
                {
                    type: "input",
                    onChange: (e) => handleDurationChange(+e.target.value),
                },
                {
                    type: "input",
                    onChange: (e) => handleDurationChange(+e.target.value),
                },
                { type: "text", value: "h:m:s", unit: "true" },
            ],
        },
        {
            key: "distance",
            cells: [
                {
                    type: "text",
                    value: "Distance",
                },
                {
                    type: "input",
                    onChange: (e) => handleDistanceChange(+e.target.value),
                },
                {
                    type: "input",
                    onChange: (e) => handleDistanceChange(+e.target.value),
                },
                { type: "text", value: "km", unit: "true" },
            ],
        },
        {
            key: "avgSpeed",
            cells: [
                {
                    type: "text",
                    value: "Average Speed",
                },
                {
                    type: "input",
                    onChange: (e) => handleSpeedChange(+e.target.value),
                },
                {
                    type: "input",
                    onChange: (e) => handleSpeedChange(+e.target.value),
                },
                { type: "text", value: "kph", unit: "true" },
            ],
        },
        {
            key: "calories",
            cells: [
                { type: "text", value: "Calories" },
                { type: "input" },
                { type: "input" },
                { type: "text", value: "kcal", unit: "true" },
            ],
        },
        {
            key: "elevation",
            cells: [
                { type: "text", value: "Elevation Gain" },
                { type: "input" },
                { type: "input" },
                { type: "text", value: "m", unit: "true" },
            ],
        },
        {
            key: "tss",
            cells: [
                { type: "text", value: "TSS" },
                { type: "input" },
                { type: "input" },
                { type: "text", value: "TSS", unit: "true" },
            ],
        },
        {
            key: "if",
            cells: [
                { type: "text", value: "IF" },
                { type: "input" },
                { type: "input" },
                { type: "text", value: "IF", unit: "true" },
            ],
        },
        {
            key: "np",
            cells: [
                { type: "text", value: "Normalized Power" },
                { type: "disabled" },
                { type: "input" },
                { type: "text", value: "W", unit: "true" },
            ],
        },
        {
            key: "work",
            cells: [
                { type: "text", value: "Work" },
                { type: "input" },
                { type: "readonly" },
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
                { type: "readonly" },
                { type: "readonly" },
                { type: "text", value: "bpm", unit: "true" },
            ],
        },
        {
            key: "power",
            cells: [
                { type: "text", value: "Power" },
                { type: "disabled" },
                { type: "readonly" },
                { type: "readonly" },
                { type: "text", value: "W", unit: "true" },
            ],
        },
    ];

    return (
        <Flex gap={40} vertical={isFullscreen}>
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

export default PlanningTab;
