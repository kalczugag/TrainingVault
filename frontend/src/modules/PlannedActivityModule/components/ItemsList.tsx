import { Button, Space, Typography } from "antd";
import bikeIcon from "@/style/images/bike.svg";

const { Text } = Typography;

interface ItemsListProps {
    title: string;
    items: {
        icon?: string;
        title: string;
        onClick?: () => void;
    }[];
}

const Item = ({ title, icon }: { title: string; icon: string }) => {
    return (
        <li>
            <Button>
                <img src={icon} className="h-6" />
                <span>{title}</span>
            </Button>
        </li>
    );
};

const ItemsList = ({ title }: ItemsListProps) => {
    return (
        <Space>
            <Text>{title}</Text>
            <Item title="Bike" icon={bikeIcon} />
        </Space>
    );
};

export default ItemsList;
