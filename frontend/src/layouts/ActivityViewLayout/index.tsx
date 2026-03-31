import { Flex, Row, Col, Typography } from "antd";
import type { Activity } from "@/types/Activity";

interface ActivityViewLayout {
    isFullscreen: boolean;
    topContent: React.ReactNode;
    mainContent: React.ReactNode;
    header: React.ReactNode;
    footer: React.ReactNode;
}

const { Title } = Typography;

const ActivityViewLayout = ({
    isFullscreen,
    topContent,
    mainContent,
    header,
    footer,
}: ActivityViewLayout) => {
    return (
        <Flex vertical style={{ width: "100%", height: "100%" }}>
            <div style={{ marginBottom: 16 }}>{header}</div>

            {isFullscreen && (
                <div className="bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center mb-4 min-h-37.5">
                    {topContent}
                </div>
            )}

            <Row gutter={24} style={{ flex: 1 }}>
                <Col
                    span={isFullscreen ? 12 : 24}
                    style={{ height: isFullscreen ? "50vh" : "60vh" }}
                >
                    {mainContent}
                </Col>

                {isFullscreen && (
                    <Col span={12}>
                        <div className="h-full pl-6 border-l border-gray-200">
                            <Title level={4}>Advanced Analysis</Title>
                            <p className="text-gray-500">
                                <ul className="list-disc ml-5 mt-2">
                                    <li>laps</li>
                                    <li>intervals</li>
                                    <li>gps fullscreen map</li>
                                </ul>
                            </p>
                        </div>
                    </Col>
                )}
            </Row>

            <div style={{ marginTop: 16 }}>{footer}</div>
        </Flex>
    );
};

export default ActivityViewLayout;
