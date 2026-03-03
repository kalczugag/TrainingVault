import { Form, Button } from "antd";
import Loading from "@/components/Loading";
import LoginForm from "@/forms/LoginForm";
import type { FieldType } from "@/forms/LoginForm";
import AuthModule from "@/modules/AuthModule";

const Login = () => {
    const handleSubmit = (values: FieldType) => {
        console.log(values);
    };

    const isLoading = false;

    const FormContainer = () => {
        return (
            <Loading isLoading={isLoading}>
                <Form
                    layout="vertical"
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
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
            </Loading>
        );
    };

    return <AuthModule authContent={<FormContainer />} authTitle="Log In" />;
};

export default Login;
