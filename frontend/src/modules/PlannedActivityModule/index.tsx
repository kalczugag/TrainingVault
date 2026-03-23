import { useState } from "react";
import { Button, Flex, Modal, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ItemsList from "./components/ItemsList";
import StepModal, { type StepModalItemProps } from "@/components/StepModal";

const { Text } = Typography;

interface PlannedActivityModuleProps {
    date: string;
}

const PlannedActivityModule = ({ date }: PlannedActivityModuleProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            content: <div>x</div>,
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
