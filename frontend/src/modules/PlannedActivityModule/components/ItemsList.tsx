import { Button, Col, Row, Space, Typography } from "antd";

const { Text } = Typography;

interface ItemsListProps {
    title: string;
    span?: number;
    items: {
        key: string;
        icon?: string;
        title: string;
        onClick?: () => void;
    }[];
}

const Item = ({
    title,
    icon,
    span,
    onClick,
}: {
    title: string;
    icon?: string;
    span: number;
    onClick?: () => void;
}) => {
    return (
        <Col span={span}>
            <Button onClick={onClick} style={{ width: "100%" }}>
                {icon && <img src={icon} alt={title} className="" />}
                <span>{title}</span>
            </Button>
        </Col>
    );
};

const ItemsList = ({ key, span = 6, title, items }: ItemsListProps) => {
    return (
        <Space vertical>
            <Text type="secondary">{title}</Text>
            <Row gutter={[16, 16]}>
                {items.map((item) => (
                    <Item
                        key={item.title}
                        span={span}
                        title={item.title}
                        icon={item.icon}
                        onClick={item.onClick}
                    />
                ))}
            </Row>
        </Space>
    );
};

export default ItemsList;
