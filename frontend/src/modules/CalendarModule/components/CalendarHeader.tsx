import { useState } from "react";
import type { Dayjs } from "dayjs";
import { Button, DatePicker, Space, Tooltip } from "antd";
import { DownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface CalendarHeaderProps {
    value: Dayjs;
    onChange: (date: Dayjs) => void;
    setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
}

const getDaysOfWeek = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
        days.push(dayjs().day(i).format("ddd"));
    }
    return days;
};

const CalendarHeader = ({
    value,
    onChange,
    setSelectedDate,
}: CalendarHeaderProps) => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    return (
        <div className="fixed bg-white top-10 left-0 right-0 z-50 shadow">
            <div className="h-16 flex items-center p-6">
                <Space size="middle">
                    <Tooltip title="Select Date" placement="bottom">
                        <div
                            style={{
                                position: "relative",
                                display: "inline-flex",
                                alignItems: "center",
                            }}
                        >
                            <Space
                                onClick={() => setIsDatePickerOpen(true)}
                                style={{
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: 500,
                                    width: "150px",
                                }}
                            >
                                <span>{value.format("MMMM YYYY")}</span>
                                <DownOutlined
                                    style={{
                                        transition: "0.3s",
                                        transform: isDatePickerOpen
                                            ? "rotate(180deg)"
                                            : "none",
                                    }}
                                />
                            </Space>
                            <DatePicker
                                open={isDatePickerOpen}
                                onOpenChange={(open) =>
                                    setIsDatePickerOpen(open)
                                }
                                onChange={(date) => {
                                    if (date) {
                                        onChange(date);
                                    }
                                    setIsDatePickerOpen(false);
                                }}
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    visibility: "hidden",
                                    width: 0,
                                    height: 0,
                                    padding: 0,
                                    border: "none",
                                }}
                            />
                        </div>
                    </Tooltip>
                    <Tooltip title="Get to Today" placement="bottom">
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSelectedDate(null);
                                onChange(dayjs());
                            }}
                        >
                            Today
                        </Button>
                    </Tooltip>
                    <Tooltip title="Back One month" placement="bottom">
                        <Button
                            icon={<LeftOutlined />}
                            onClick={() => {
                                setSelectedDate(null);
                                onChange(value.clone().subtract(1, "month"));
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Forwar One month" placement="bottom">
                        <Button
                            icon={<RightOutlined />}
                            onClick={() =>
                                onChange(value.clone().add(1, "month"))
                            }
                        />
                    </Tooltip>
                </Space>
            </div>
            <div className="flex w-full border-y border-gray-200 min-w-225">
                {[...getDaysOfWeek(), "Summary"].map((day) => (
                    <div
                        key={day}
                        className="flex-1 p-2 px-6 pr-4 text-gray-400 font-medium text-xs uppercase tracking-wider"
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarHeader;
