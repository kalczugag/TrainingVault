import { useEffect, useState, type ReactNode } from "react";
import { Modal } from "antd";

export interface StepModalItemProps {
    key: string;
    title: ReactNode;
    content: ReactNode;
}

interface StepModalProps {
    open: boolean;
    steps: StepModalItemProps[];
    onCancel: () => void;
    onFinish: () => void;
}

const StepModal = ({ steps, open, onCancel, onFinish }: StepModalProps) => {
    const [activeKey, setActiveKey] = useState(steps[0]?.key || "");

    useEffect(() => {
        if (open && steps.length > 0) {
            setActiveKey(steps[0].key);
        }
    }, [open, steps]);

    const activeStepIndex = steps.findIndex((step) => step.key === activeKey);
    const activeStep = steps[activeStepIndex];

    const dynamicTitle = activeStep && `${activeStep.title}`;

    const handleNext = () => {
        if (activeStepIndex < steps.length - 1) {
            setActiveKey(steps[activeStepIndex + 1].key);
        } else {
            onFinish();
        }
    };

    const handleBack = () => {
        if (activeStepIndex > 0) {
            setActiveKey(steps[activeStepIndex - 1].key);
        }
    };

    return (
        <Modal
            destroyOnHidden
            centered
            title={dynamicTitle}
            open={open}
            onOk={onFinish}
            onCancel={onCancel}
        ></Modal>
    );
};

export default StepModal;
