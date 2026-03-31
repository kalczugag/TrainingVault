import { useEffect, useState, type ReactNode } from "react";
import { Modal, type ModalProps } from "antd";

interface StepNavProps {
    next: () => void;
    back: () => void;
    goTo: (key: string) => void;
}

export interface StepModalItemProps {
    key: string;
    title?: ReactNode;
    content: (nav: StepNavProps) => ReactNode;
}

interface StepModalProps extends ModalProps {
    open: boolean;
    steps: StepModalItemProps[];
    layout?: React.ElementType;
    onCancel: () => void;
    onFinish: () => void;
}

const StepModal = ({
    steps,
    open,
    layout: Layout,
    onCancel,
    onFinish,
    ...props
}: StepModalProps) => {
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

    const content = activeStep?.content({
        next: handleNext,
        back: handleBack,
        goTo: setActiveKey,
    });

    return (
        <Modal
            destroyOnHidden
            centered
            title={activeStep?.title || undefined}
            open={open}
            onOk={onFinish}
            onCancel={onCancel}
            footer={false}
            {...props}
        >
            {Layout ? <Layout>{content}</Layout> : content}
        </Modal>
    );
};

export default StepModal;
