import { Form, Input, Checkbox } from "antd";

export type FieldType = {
    email: string;
    password: string;
};

const LoginForm = () => {
    return (
        <div>
            <Form.Item<FieldType>
                name="email"
                rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Invalid email" },
                ]}
            >
                <Input placeholder="Email" type="email" size="large" />
            </Form.Item>
            <Form.Item<FieldType>
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
            >
                <Input.Password placeholder="Password" size="large" />
            </Form.Item>
        </div>
    );
};

export default LoginForm;
