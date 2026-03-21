import { useState } from "react";
import {
    Button,
    Descriptions,
    Divider,
    Flex,
    Layout,
    Modal,
    Space,
    Tooltip,
} from "antd";
import {
    ShrinkOutlined,
    ArrowsAltOutlined,
    CloseOutlined,
    FileOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDeleteActivityMutation } from "@/store";
import type { Activity } from "@/types/Activity";
import ActivityCard from "./components/ActivityCard";
import SideNavigation from "./components/SideNavigation";

const { Content } = Layout;

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

    return (
        <>
            <ActivityCard item={item} showModal={showModal} />
            <Modal
                destroyOnHidden
                closable={false}
                width={"100%"}
                centered
                style={{
                    maxWidth: isFullscreen ? "100%" : "700px",
                }}
                title={
                    <Flex vertical gap={8} style={{ width: "100%" }}>
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
                                    <Button icon={<FileOutlined />}>
                                        Files
                                    </Button>
                                </Tooltip>
                                <Button
                                    type="primary"
                                    onClick={toggleFullscreen}
                                >
                                    Analyze
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                }
                open={isModalOpen}
                onCancel={handleCancel}
                footer={() => (
                    <>
                        <Divider />
                        <Button
                            type="text"
                            onClick={handleDelete}
                            loading={isDeleteLoading}
                            disabled={disabledButtons}
                        >
                            Delete
                        </Button>
                        <Button
                            type="text"
                            onClick={handleCancel}
                            disabled={disabledButtons}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="text"
                            onClick={handleSave}
                            disabled={disabledButtons}
                        >
                            Save
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSaveAndClose}
                            disabled={disabledButtons}
                        >
                            Save & close
                        </Button>
                    </>
                )}
            >
                <Layout hasSider style={{ backgroundColor: "#FFF" }}>
                    <Content
                        style={{
                            height: "60vh",
                        }}
                    >
                        <SideNavigation
                            item={item}
                            isFullscreen={isFullscreen}
                        />
                    </Content>
                </Layout>
            </Modal>
        </>
    );
};

export default ActivityModal;
