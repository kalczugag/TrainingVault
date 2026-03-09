import { useState } from "react";
import {
    Button,
    Descriptions,
    Divider,
    Flex,
    Layout,
    Modal,
    Space,
} from "antd";
import {
    ShrinkOutlined,
    ArrowsAltOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { Activity } from "@/types/Activity";
import ActivityCard from "./ActivityCard";
import { Content } from "antd/es/layout/layout";
import SideMenu from "./SideMenu";

interface ActivityModalProps {
    item: Activity;
}

const ActivityModal = ({ item }: ActivityModalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const showModal = () => {
        setIsFullscreen(false);
        setIsModalOpen(true);
    };

    const toggleFullscreen = () => {
        setIsFullscreen((prev) => !prev);
    };

    const handleDelete = () => {
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

    return (
        <>
            <ActivityCard item={item} showModal={showModal} />
            <Modal
                closable={false}
                width={"100%"}
                style={{ maxWidth: isFullscreen ? "100%" : "700px" }}
                title={
                    <Flex
                        justify="space-between"
                        align="start"
                        style={{ width: "100%" }}
                    >
                        <Space vertical>
                            <span className="text-blue-500 text-sm font-medium">
                                {activityDate} - {activityHour}
                            </span>
                            <Descriptions
                                style={{
                                    backgroundColor: "#F1F3F7",
                                    padding: "8px",
                                    borderRadius: "4px",
                                }}
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
                        </Space>
                        <Space>
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
                                onClick={toggleFullscreen}
                                icon={<CloseOutlined />}
                            />
                        </Space>
                    </Flex>
                }
                open={isModalOpen}
                onCancel={handleCancel}
                footer={() => (
                    <>
                        <Divider />
                        <Button type="text" onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button type="text" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="text" onClick={handleSave}>
                            Save
                        </Button>
                        <Button type="primary" onClick={handleSaveAndClose}>
                            Save & close
                        </Button>
                    </>
                )}
            >
                <Layout hasSider style={{ backgroundColor: "#FFF" }}>
                    <SideMenu />
                    <Content style={{ padding: "2px", paddingLeft: "4px" }}>
                        {item.title}
                    </Content>
                </Layout>
            </Modal>
        </>
    );
};

export default ActivityModal;
