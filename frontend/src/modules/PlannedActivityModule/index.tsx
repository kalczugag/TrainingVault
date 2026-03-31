import { useState } from "react";
import { Button, Descriptions, Flex, Space, Tooltip } from "antd";
import {
    ArrowsAltOutlined,
    CloseOutlined,
    FileOutlined,
    PlusOutlined,
    ShrinkOutlined,
} from "@ant-design/icons";
import ItemsList from "./components/ItemsList";
import StepModal, {
    type StepModalItemProps,
} from "@/components/Modals/StepModal";
import { activityIcons } from "@/style/images/activityIcons";
import dayjs from "dayjs";
import ActivityViewLayout from "@/layouts/ActivityViewLayout";

interface PlannedActivityModuleProps {
    date: string;
}

const PlannedActivityModule = ({ date }: PlannedActivityModuleProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        setIsFullscreen((prev) => !prev);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const customHeader = (
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

    const customFooter = (
        <Flex justify="end" gap={8} style={{ marginTop: 16 }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleOk}>Save</Button>
            <Button type="primary" onClick={() => {}}>
                Save & Close
            </Button>
        </Flex>
    );

    const steps: StepModalItemProps[] = [
        {
            key: "1",
            title: date,
            content: ({ next, goTo }) => (
                <Space vertical size="large">
                    <ItemsList
                        title="Add a Workout"
                        items={[
                            {
                                key: "run",
                                title: "Run",
                                icon: activityIcons.run,
                                onClick: () => {
                                    console.log("first");
                                    goTo("2");
                                },
                            },
                            {
                                key: "bike",
                                title: "Bike",
                                icon: activityIcons.bike,
                                onClick: () => next(),
                            },
                            {
                                key: "swim",
                                title: "Swim",
                                icon: activityIcons.swim,
                                onClick: () => next(),
                            },
                            {
                                key: "brick",
                                title: "Brick",
                                icon: activityIcons.brick,
                                onClick: () => next(),
                            },

                            {
                                key: "crosstrain",
                                title: "Crosstrain",
                                icon: activityIcons.crosstrain,
                                onClick: () => next(),
                            },

                            {
                                key: "dayoff",
                                title: "Day off",
                                icon: activityIcons.dayOff,
                                onClick: () => next(),
                            },

                            {
                                key: "mtnbike",
                                title: "Mtn Bike",
                                icon: activityIcons.mtnBike,
                                onClick: () => next(),
                            },

                            {
                                key: "strength",
                                title: "Strength",
                                icon: activityIcons.strength,
                                onClick: () => next(),
                            },
                            {
                                key: "custom",
                                title: "Custom",
                                icon: activityIcons.clock,
                                onClick: () => next(),
                            },
                            {
                                key: "xcski",
                                title: "XC-Ski",
                                icon: activityIcons.ski,
                                onClick: () => next(),
                            },
                            {
                                key: "rowing",
                                title: "Rowing",
                                icon: activityIcons.rowing,
                                onClick: () => next(),
                            },
                            {
                                key: "walk",
                                title: "Walk",
                                icon: activityIcons.walk,
                                onClick: () => next(),
                            },
                            {
                                key: "other",
                                title: "Other",
                                icon: activityIcons.clock,
                                onClick: () => next(),
                            },
                        ]}
                    />
                    <ItemsList
                        title="Add Other"
                        items={[
                            {
                                key: "event",
                                title: "Event",
                                icon: activityIcons.event,
                                onClick: () => {
                                    goTo("2");
                                },
                            },
                            {
                                key: "goals",
                                title: "Goals",
                                icon: activityIcons.goals,
                                onClick: () => {
                                    goTo("2");
                                },
                            },
                            {
                                key: "note",
                                title: "Note",
                                icon: activityIcons.note,
                                onClick: () => {
                                    goTo("2");
                                },
                            },
                            {
                                key: "metrics",
                                title: "Metrics",
                                icon: activityIcons.metrics,
                                onClick: () => {
                                    goTo("2");
                                },
                            },
                            {
                                key: "availability",
                                title: "Availability",
                                icon: activityIcons.calendar,
                                onClick: () => {
                                    goTo("2");
                                },
                            },
                        ]}
                    />
                    <ItemsList
                        title="Upload Device Files"
                        span={24}
                        items={[
                            {
                                key: "upload",
                                title: "Upload File",
                                icon: activityIcons.upload,
                                onClick: () => {
                                    alert("upload file");
                                },
                            },
                        ]}
                    />
                    <Button
                        type="link"
                        size="small"
                        href="upload"
                        target="_blank"
                    >
                        Learn about the many ways to AutoSync your activity
                        data.
                    </Button>
                </Space>
            ),
        },
        {
            key: "2",
            content: ({ back }) => (
                <ActivityViewLayout
                    isFullscreen={isFullscreen}
                    header={customHeader}
                    footer={customFooter}
                />
            ),
        },
    ];

    return (
        <>
            <Button
                type="text"
                color="default"
                variant="outlined"
                className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={showModal}
            >
                <PlusOutlined />
            </Button>
            <StepModal
                steps={steps}
                open={isModalOpen}
                onCancel={handleCancel}
                onFinish={handleOk}
                closable={false}
                centered
                destroyOnHidden
                width={isFullscreen ? "95vw" : "750px"}
                style={{ transition: "all 0.3s" }}
            />
            {/* <Modal

                centered
                title={date}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Flex gap="large" align="start" vertical>
                    <ItemsList title="Add a Workout" />
                    <ItemsList title="Add Other" />
                    <ItemsList title="Upload Device Files" />
                    <Button
                        type="link"
                        size="small"
                        href="upload"
                        target="_blank"
                    >
                        Learn about the many ways to AutoSync your activity
                        data.
                    </Button>
                </Flex>
            </Modal> */}
        </>
    );
};

export default PlannedActivityModule;
