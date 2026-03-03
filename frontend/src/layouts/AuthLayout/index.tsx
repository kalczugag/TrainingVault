import type { ReactNode } from "react";
import { Layout, Row, Col, ConfigProvider, theme } from "antd";

interface AuthLayoutProps {
    children: ReactNode;
    sideContent: ReactNode;
}

const AuthLayout = ({ children, sideContent }: AuthLayoutProps) => {
    return (
        <Layout>
            <Row>
                <Col
                    xs={{ span: 0, order: 1 }}
                    sm={{ span: 0, order: 1 }}
                    md={{ span: 11, order: 2 }}
                    lg={{ span: 12, order: 2 }}
                    style={{
                        background: "#010F31",
                        minHeight: "100vh",
                    }}
                >
                    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                        {sideContent}
                    </ConfigProvider>
                </Col>
                <Col
                    xs={{ span: 24, order: 2 }}
                    sm={{ span: 24, order: 2 }}
                    md={{ span: 13, order: 1 }}
                    lg={{ span: 12, order: 1 }}
                    style={{
                        background: "#FFF",
                        minHeight: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {children}
                </Col>
            </Row>
        </Layout>
    );
};

export default AuthLayout;
