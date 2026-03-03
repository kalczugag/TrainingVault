import { Layout, Typography } from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

const SideContent = () => {
    return (
        <Content
            style={{
                padding: "150px 30px 30px",
                width: "100%",
                maxWidth: "450px",
                margin: "0 auto",
            }}
            className="sideContent"
        >
            <Title level={2}>For the All-In Athlete</Title>
            <Text>A complete training ecosystem as committed as you are.</Text>
        </Content>
    );
};

export default SideContent;
