import { Button, Flex } from "antd";

interface FooterContentProps {
    handleOk: () => void;
    handleCancel: () => void;
}

const FooterContent = ({ handleCancel, handleOk }: FooterContentProps) => {
    return (
        <Flex justify="end" gap={8} style={{ marginTop: 16 }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleOk}>Save</Button>
            <Button type="primary" onClick={() => {}}>
                Save & Close
            </Button>
        </Flex>
    );
};

export default FooterContent;
