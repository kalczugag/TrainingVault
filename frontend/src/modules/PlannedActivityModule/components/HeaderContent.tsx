import {
    ArrowsAltOutlined,
    CloseOutlined,
    FileOutlined,
    ShrinkOutlined,
} from "@ant-design/icons";
import { Button, Descriptions, Flex, Space, Tooltip, Form } from "antd";

interface HeaderContentProps {
    date: string;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    handleCancel: () => void;
}

const HeaderContent = ({
    date,
    isFullscreen,
    toggleFullscreen,
    handleCancel,
}: HeaderContentProps) => {
    const form = Form.useFormInstance();

    return (
        <Flex vertical gap={8}>
            <Flex align="center" justify="space-between">
                <span className="text-blue-500 text-sm font-medium">
                    {date}
                </span>
                <Space size={0}>
                    <Button
                        type="text"
                        onClick={toggleFullscreen}
                        icon={
                            isFullscreen ? (
                                <ShrinkOutlined />
                            ) : (
                                <ArrowsAltOutlined />
                            )
                        }
                    />
                    <Button
                        type="text"
                        onClick={handleCancel}
                        icon={<CloseOutlined />}
                    />
                </Space>
            </Flex>
            <Flex gap={8} align="start">
                <Descriptions
                    style={{
                        backgroundColor: "#F1F3F7",
                        padding: "8px",
                        borderRadius: "4px",
                    }}
                    column={3}
                    styles={{ content: { textWrap: "nowrap" } }}
                    title="Untitled Workout"
                >
                    <Descriptions.Item label="Duration">
                        --:--:--
                    </Descriptions.Item>
                    <Descriptions.Item label="Distance">--</Descriptions.Item>
                    <Descriptions.Item label="TSS">--</Descriptions.Item>
                </Descriptions>
                <Flex vertical justify="space-between" gap={8}>
                    <Tooltip
                        title="A file from a connected device or you computer."
                        placement="bottom"
                    >
                        <Button icon={<FileOutlined />}>Upload</Button>
                    </Tooltip>
                    <Button disabled type="primary" onClick={toggleFullscreen}>
                        Analyze
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default HeaderContent;
