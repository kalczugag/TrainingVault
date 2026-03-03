import type { ReactNode } from "react";
import { Layout, Typography, Col } from "antd";
import logo from "@/style/images/logo-dark.svg";
import AuthLayout from "@/layouts/AuthLayout";
import SideContent from "./SideContent";

interface AuthModuleProps {
    authContent: ReactNode;
    authTitle: string;
    isForRegistre?: boolean;
}

const { Content } = Layout;
const { Title } = Typography;

const AuthModule = ({
    authContent,
    authTitle,
    isForRegistre = false,
}: AuthModuleProps) => {
    return (
        <AuthLayout sideContent={<SideContent />}>
            <Content
                style={{
                    padding: isForRegistre
                        ? "40px 30px 30px"
                        : "100px 30px 30px",
                    maxWidth: "440px",
                    margin: "0 auto",
                }}
            >
                <Col span={24}>
                    <img
                        src={logo}
                        alt="logo"
                        style={{
                            margin: "0 auto 40px",
                            display: "block",
                        }}
                        height={60}
                        width={290}
                    />
                </Col>
                <Title level={2} style={{ textAlign: "center" }}>
                    {authTitle}
                </Title>
                <div>{authContent}</div>
            </Content>
        </AuthLayout>
    );
};

export default AuthModule;
