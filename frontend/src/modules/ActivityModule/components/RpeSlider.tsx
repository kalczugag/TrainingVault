import { Flex, Slider, Space, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const rpeDescriptions: Record<number, string[]> = {
    0: ["No exertion", "Restful, no effort."],
    1: ["Very light", "Minimal effort."],
    2: ["Light", "Light effort."],
    3: ["Moderate", "Conversational pace."],
    4: ["Somewhat hard", "Challenging yet manageable."],
    5: ["Hard", "Conversation becomes difficult."],
    6: ["Harder", "Noticeably challenging, requires more focus."],
    7: ["Very hard", "Near the limit, conversation hard."],
    8: ["Extremely hard", "Very challenging, intense focus."],
    9: ["Near maximum", "Can't maintain for long."],
    10: ["Maximal effort", "No harder effort possible."],
};

interface RpeSliderProps {
    value?: number;
    onChange?: (value: number) => void;
}

const RpeSlider = ({ value = 0, onChange }: RpeSliderProps) => {
    const currentDescription = rpeDescriptions[value] || ["Unknown RPE", ""];

    return (
        <Space style={{ width: "100%" }} vertical>
            <Flex
                vertical
                align="center"
                style={{ fontSize: "12px", height: "50px" }}
            >
                <div className="text-gray-700">{currentDescription[0]}</div>
                <div className="text-gray-500 text-center">
                    {currentDescription[1]}
                </div>
            </Flex>

            <Slider
                min={0}
                max={10}
                step={1}
                value={value}
                onChange={onChange}
                className="mx-3!"
                tooltip={{ placement: "bottom" }}
                styles={{
                    rail: {
                        background:
                            "linear-gradient(to right, #1890ff 0%, #a0d911 25%, #fadb14 50%, #fa8c16 75%, #f5222d 100%)",
                        opacity: 1,
                    },
                    track: {
                        background: "transparent",
                    },
                }}
            />
        </Space>
    );
};

export default RpeSlider;
