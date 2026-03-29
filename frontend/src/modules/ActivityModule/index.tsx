import { useState } from "react";
import { useDeleteActivityMutation } from "@/store";
import type { Activity } from "@/types/Activity";
import dayjs from "dayjs";
import { Button, Descriptions, Flex, Modal, Space, Tooltip } from "antd";
import {
    ArrowsAltOutlined,
    CloseOutlined,
    FileOutlined,
    ShrinkOutlined,
} from "@ant-design/icons";
import ActivityCard from "./components/ActivityCard";
import ActivityViewLayout from "./Layouts/ActivityViewLayout";

interface ActivityModalProps {
    item: Activity;
}

const ActivityModal = ({ item }: ActivityModalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [deleteActivity, { isLoading: isDeleteLoading }] =
        useDeleteActivityMutation();

    const showModal = () => {
        setIsFullscreen(false);
        setIsModalOpen(true);
    };

    const toggleFullscreen = () => {
        setIsFullscreen((prev) => !prev);
    };

    const handleDelete = async () => {
        await deleteActivity(item._id);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSave = () => {
        console.log("save");
    };

    const handleSaveAndClose = () => {
        setIsModalOpen(false);
    };

    const activityDate = dayjs(item.startTime).format("dddd D MMMM YYYY");
    const activityHour = dayjs(item.startTime).format("HH:mm");

    const disabledButtons = isDeleteLoading;

    const customHeader = (
        <Flex vertical gap={8}>
            <Flex align="center" justify="space-between">
                <span className="text-blue-500 text-sm font-medium">
                    {activityDate} - {activityHour}
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
                    title={item.title}
                >
                    <Descriptions.Item label="Duration">
                        {dayjs
                            .duration(item.durationSec, "seconds")
                            .format("HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Distance">
                        {(item.distanceMeters / 1000).toFixed(1)}
                    </Descriptions.Item>
                    <Descriptions.Item label="TSS">
                        {item.summary.tss}
                    </Descriptions.Item>
                </Descriptions>
                <Flex vertical justify="space-between" gap={8}>
                    <Tooltip
                        title="Upload/download/delete files or recalculate workout statistics."
                        placement="bottom"
                    >
                        <Button icon={<FileOutlined />}>Files</Button>
                    </Tooltip>
                    <Button type="primary" onClick={toggleFullscreen}>
                        Analyze
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );

    const customFooter = (
        <Flex justify="end" gap={8} style={{ marginTop: 16 }}>
            <Button danger onClick={handleDelete} loading={isDeleteLoading}>
                Delete
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSaveAndClose}>
                Save & Close
            </Button>
        </Flex>
    );

    return (
        <>
            <ActivityCard item={item} showModal={showModal} />
            <Modal
                open={isModalOpen}
                footer={false}
                closable={false}
                centered
                destroyOnHidden
                onCancel={handleCancel}
                width={isFullscreen ? "95vw" : "750px"}
                style={{ transition: "all 0.3s" }}
            >
                <ActivityViewLayout
                    item={item}
                    isFullscreen={isFullscreen}
                    header={customHeader}
                    footer={customFooter}
                />
            </Modal>
        </>
    );
};

export default ActivityModal;
