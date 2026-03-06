import type { ReactNode } from "react";
import { Layout } from "antd";
import HeaderContent from "@/components/HeaderContent";

const { Content, Footer } = Layout;

interface NavigationLayoutProps {
    children: ReactNode;
}

const NavigationLayout = ({ children }: NavigationLayoutProps) => {
    return (
        <Layout>
            <HeaderContent />
            <Content
                style={{
                    background: "#FFF",
                    padding: "16px",
                }}
            >
                <div>{children}</div>
            </Content>
            {/* <Footer style={{ textAlign: "center", background: "#FFF" }}>
                TrainingVault ©{new Date().getFullYear()} Created by kalczugag
            </Footer> */}
        </Layout>
    );
};

export default NavigationLayout;
