import { useState } from "react";
import { Button, Form, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ItemsList from "./components/ItemsList";
import StepModal, {
    type StepModalItemProps,
} from "@/components/Modals/StepModal";
import { activityIcons } from "@/style/images/activityIcons";
import ActivityViewLayout from "@/layouts/ActivityViewLayout";
import FooterContent from "./components/FooterContent";
import HeaderContent from "./components/HeaderContent";
import PlanningTab from "./tabs/PlanningTab";

interface PlannedActivityModuleProps {
    date: string;
}

const PlannedActivityModule = ({ date }: PlannedActivityModuleProps) => {
    const [form] = Form.useForm();

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
                    header={
                        <HeaderContent
                            date={date}
                            isFullscreen={isFullscreen}
                            toggleFullscreen={toggleFullscreen}
                            handleCancel={handleCancel}
                        />
                    }
                    footer={
                        <FooterContent handleCancel={back} handleOk={back} />
                    }
                    mainContent={<PlanningTab isFullscreen={isFullscreen} />}
                    topContent={<div>top</div>}
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
            <Form
                form={form}
                name="plan_workout"
                initialValues={{ autoCalc: true }}
                onFinish={handleOk}
                autoComplete="off"
            >
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
            </Form>
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
