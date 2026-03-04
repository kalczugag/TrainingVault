import { Form, Input, Checkbox, Typography, Select, Row, Col } from "antd";
import { SPORT_TYPES, type SportType } from "@/constants/activities";
import { capitalizeFirstLetter } from "@/utils/helpers";

const { Title, Text } = Typography;

export type FieldType = {
    fullName: string;
    primarySport: SportType;
    gender: "male" | "female";
    username: string;
    email: string;
    password: string;
    birthDate: {
        month: string;
        day: string;
        year: string;
    };
    agreement?: boolean;
};

const RegisterForm = () => {
    const sportTypeOptions = Object.values(SPORT_TYPES).map((sport) => ({
        label: capitalizeFirstLetter(sport),
        value: sport,
    }));

    return (
        <div>
            <Form.Item<FieldType>
                name="fullName"
                rules={[{ required: true, message: "Name is required" }]}
            >
                <Input placeholder="First and Last Name" size="large" />
            </Form.Item>
            <Form.Item<FieldType>
                name="email"
                rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Invalid email" },
                ]}
            >
                <Input placeholder="Email" type="email" size="large" />
            </Form.Item>
            <Form.Item noStyle>
                <Row gutter={16}>
                    <Col span={12} xs={24} md={12}>
                        <Form.Item<FieldType>
                            name="primarySport"
                            rules={[
                                {
                                    required: true,
                                    message: "Primary sport is required",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Primary Sport"
                                options={sportTypeOptions}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12} xs={24} md={12}>
                        <Form.Item<FieldType>
                            name="gender"
                            rules={[
                                {
                                    required: true,
                                    message: "Gender is required",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Gender"
                                options={[
                                    { label: "Male", value: "male" },
                                    { label: "Female", value: "female" },
                                ]}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>
            <Form.Item>
                <Row gutter={16}>
                    <Col span={12} xs={24} md={12}>
                        <Form.Item<FieldType>
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Username is required",
                                },
                            ]}
                        >
                            <Input placeholder="Username" size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={12} xs={24} md={12}>
                        <Form.Item<FieldType>
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Password is required",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Password"
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>
            <Form.Item noStyle>
                <Title level={4} style={{ margin: 0, padding: 0 }}>
                    Enter Your Birthday
                </Title>
                <Text style={{ fontSize: "12px" }}>
                    Your date of birth help us imrpove your TrainingVault
                    experience.
                </Text>
                <Row gutter={16}>
                    <Col span={12} xs={8}>
                        <Form.Item<FieldType>
                            name={["birthDate", "day"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Day is required",
                                },
                            ]}
                        >
                            <Input placeholder="DD" size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={12} xs={8}>
                        <Form.Item<FieldType>
                            name={["birthDate", "month"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Month is required",
                                },
                            ]}
                        >
                            <Input placeholder="MM" size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={12} xs={8}>
                        <Form.Item<FieldType>
                            name={["birthDate", "year"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Year is required",
                                },
                            ]}
                        >
                            <Input placeholder="YYYY" size="large" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>
            <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                    {
                        required: true,
                        message: "Should accept agreement",
                    },
                ]}
            >
                <Checkbox>
                    I have read the <a href="">agreement</a>
                </Checkbox>
            </Form.Item>
        </div>
    );
};

export default RegisterForm;
