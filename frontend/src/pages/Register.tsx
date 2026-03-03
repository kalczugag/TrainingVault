import { useState } from "react";
import { Form, Button } from "antd";
import { omit } from "@/utils/helpers";
import RegisterForm from "@/forms/RegisterForm";
import type { FieldType } from "@/forms/RegisterForm";
import AuthModule from "@/modules/AuthModule";

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (values: FieldType) => {
        setIsLoading(true);

        const { month, day, year } = values.birthDate;

        const date = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
        );
        const firstName = values.fullName.split(" ")[0];
        const lastName = values.fullName.split(" ")[1];
        const data = omit(values, ["fullName"]);

        console.log({ ...data, firstName, lastName, birthDate: date });
    };

    const FormContainer = () => {
        return (
            <div>
                <Form
                    layout="vertical"
                    name="normal_register"
                    className="register-form"
                    onFinish={handleSubmit}
                    disabled={isLoading}
                >
                    <RegisterForm />
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            disabled={false}
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
            </div>
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
