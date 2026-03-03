import { Form, Button } from "antd";
import Loading from "@/components/Loading";
import RegisterForm from "@/forms/RegisterForm";
import type { FieldType } from "@/forms/LoginForm";
import AuthModule from "@/modules/AuthModule";

const Register = () => {
    const handleSubmit = (values: FieldType) => {
        console.log(values);
    };

    const isLoading = false;

    const FormContainer = () => {
        return (
            <Loading isLoading={isLoading}>
                <Form
                    layout="vertical"
                    name="normal_register"
                    className="register-form"
                    initialValues={{
                        fullName: "",
                        email: "",
                        username: "",
                        password: "",
                        birthDate: "",
                    }}
                    onFinish={handleSubmit}
                >
                    <RegisterForm />
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            size="large"
                            block
                        >
                            Sign up
                        </Button>
                    </Form.Item>
                </Form>
                <div className="flex flex-col items-center space-y-4">
                    <span>
                        Already have an account? <a href="/login">Log In</a>
                    </span>
                </div>
            </Loading>
        );
    };

    return (
        <AuthModule
            authContent={<FormContainer />}
            authTitle="Create Your Athlete Account"
        />
    );
};

export default Register;
