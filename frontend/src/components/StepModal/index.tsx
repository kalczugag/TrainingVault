import { useEffect, useState, type ReactNode } from "react";
import { Modal } from "antd";

interface StepNavProps {
    next: () => void;
    back: () => void;
    goTo: (key: string) => void;
}

export interface StepModalItemProps {
    key: string;
    title: ReactNode;
    content: (nav: StepNavProps) => ReactNode;
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
    }, [open]);

    const activeStepIndex = steps.findIndex((step) => step.key === activeKey);
    const activeStep = steps[activeStepIndex] || steps[0];

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
            title={activeStep?.title}
            open={open}
            onOk={onFinish}
            onCancel={onCancel}
            footer={false}
        >
            {activeStep?.content({
                next: handleNext,
                back: handleBack,
                goTo: setActiveKey,
            })}
        </Modal>
    );
};

export default StepModal;
