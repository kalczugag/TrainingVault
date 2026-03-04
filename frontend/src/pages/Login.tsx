import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "antd";
import { useLoginMutation } from "@/store";
import LoginForm from "@/forms/LoginForm";
import type { FieldType } from "@/forms/LoginForm";
import AuthModule from "@/modules/AuthModule";

const Login = () => {
    const navigate = useNavigate();
    const [login, { isLoading, isSuccess }] = useLoginMutation();

    useEffect(() => {
        if (isSuccess) navigate("/");
    }, [isSuccess]);

    const handleSubmit = async (values: FieldType) => {
        await login(values);
    };

    const FormContainer = () => {
        return (
            <div>
                <Form
                    layout="vertical"
                    name="normal_login"
                    className="login-form"
                    disabled={isLoading}
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    onFinish={handleSubmit}
                >
                    <LoginForm />
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            disabled={false}
                            size="large"
                            block
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
                <div className="flex flex-col items-center space-y-4">
                    <a href="/forgetpassword">Forgot Password</a>
                    <span>
                        Don't have an account?{" "}
                        <a href="/register">Create an Athlete Account</a>
                    </span>
                </div>
            </div>
        );
    };

    return <AuthModule authContent={<FormContainer />} authTitle="Log In" />;
};

export default Login;
