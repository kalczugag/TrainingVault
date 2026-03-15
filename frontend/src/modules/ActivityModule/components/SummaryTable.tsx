import { Col, Input, Row } from "antd";

export interface SummaryTableProps {
    stats: {
        label: string;
        value: string | number;
        unit: string;
        isBlue?: boolean;
    }[];
    header: string[];
}

const SummaryTable = ({ stats, header }: SummaryTableProps) => {
    return (
        <div className="flex-1">
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

export default SummaryTable;
