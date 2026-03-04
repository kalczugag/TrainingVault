import type { ReactNode } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface LoadingProps {
    isLoading: boolean;
    children?: ReactNode;
}

const Loading = ({ isLoading, children }: LoadingProps) => {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        <>
            {children ? (
                <Spin indicator={antIcon} spinning={isLoading}>
                    {children}
                </Spin>
            ) : (
                <Spin indicator={antIcon} spinning={isLoading} />
            )}
        </>
    );
};

export default Loading;
