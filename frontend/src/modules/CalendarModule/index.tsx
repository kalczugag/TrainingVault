import { useState } from "react";
import { DownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Badge, Button, Calendar, DatePicker, Divider, Space } from "antd";
import type { BadgeProps, CalendarProps, Card, Flex } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const getListData = (value: Dayjs) => {
    let listData: { type: string; content: string }[] = [];
    switch (value.date()) {
        case 8:
            listData = [
                { type: "warning", content: "This is warning event." },
                { type: "success", content: "This is usual event." },
            ];
            break;
        case 10:
            listData = [
                { type: "warning", content: "This is warning event." },
                { type: "success", content: "This is usual event." },
                { type: "error", content: "This is error event." },
            ];
            break;
        case 15:
            listData = [
                { type: "warning", content: "This is warning event" },
                {
                    type: "success",
                    content: "This is very long usual event......",
                },
                { type: "error", content: "This is error event 1." },
                { type: "error", content: "This is error event 2." },
                { type: "error", content: "This is error event 3." },
                { type: "error", content: "This is error event 4." },
            ];
            break;
        default:
    }
    return listData || [];
};

const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
        <ul className="events">
            {listData.map((item) => (
                <li key={item.content}>
                    <Badge
                        status={item.type as BadgeProps["status"]}
                        text={item.content}
                    />
                </li>
            ))}
        </ul>
    );
};

const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") {
        return dateCellRender(current);
    }

    return info.originNode;
};

const CalendarModule = () => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    return (
        <Calendar
            cellRender={cellRender}
            headerRender={({ value, onChange }) => (
                <div>
                    <Space size="middle">
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
                        <Button
                            variant="outlined"
                            onClick={() => onChange(dayjs())}
                        >
                            Today
                        </Button>
                        <Button
                            icon={<LeftOutlined />}
                            onClick={() =>
                                onChange(value.clone().subtract(1, "month"))
                            }
                        />
                        <Button
                            icon={<RightOutlined />}
                            onClick={() =>
                                onChange(value.clone().add(1, "month"))
                            }
                        />
                    </Space>
                    <Divider />
                </div>
            )}
        />
    );
};

export default CalendarModule;
