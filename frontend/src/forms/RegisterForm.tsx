import { Form, Input, Checkbox, Select } from "antd";
import { SPORT_TYPES, type SportType } from "@/constants/activities";
import { capitalizeFirstLetter } from "@/utils/helpers";

export type FieldType = {
    fullName: string;
    primarySport: SportType;
    gender: "male" | "female";
    username: string;
    email: string;
    password: string;
    birthDate: string;
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
            <Form.Item>
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
                <Form.Item<FieldType>
                    name="gender"
                    rules={[{ required: true, message: "Gender is required" }]}
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
            </Form.Item>
        </div>
    );
};

export default RegisterForm;
