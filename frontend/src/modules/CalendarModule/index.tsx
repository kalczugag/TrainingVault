import { useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/pl";
import enGB from "antd/es/locale/pl_PL";
import duration from "dayjs/plugin/duration";
import bikeIcon from "@/style/images/bike.svg";
import { useGetActivitiesQuery } from "@/store";
import { DownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
    Button,
    Calendar,
    DatePicker,
    Space,
    Card,
    ConfigProvider,
    Tooltip,
} from "antd";
import { Flex, type CalendarProps } from "antd";

dayjs.extend(duration);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
    weekstart: 1,
});

const CalendarModule = () => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const { data } = useGetActivitiesQuery({});

    const getDaysOfWeek = () => {
        const days = [];
        for (let i = 1; i <= 7; i++) {
            days.push(dayjs().day(i).format("ddd"));
        }
        return days;
    };

    const getListData = (value: Dayjs) => {
        const activitiesForThisDay = data?.result.filter((activity) =>
            dayjs(activity.startTime).isSame(value, "day"),
        );
        return activitiesForThisDay;
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);

        if (listData?.length === 0) return null;

        return (
            <ul>
                {listData?.map((item) => (
                    <li
                        key={item._id}
                        onClick={() => alert(`clicked ${item.title}`)}
                        style={{ marginBottom: "8px" }}
                    >
                        <Card size="small">
                            <Card.Meta
                                title={
                                    item.sportType === "cycling" && (
                                        <Flex vertical gap={4}>
                                            <img
                                                alt="bike icon"
                                                src={bikeIcon}
                                                className="w-6"
                                            />
                                            <span className="text-xs">
                                                {item.title}
                                            </span>
                                        </Flex>
                                    )
                                }
                            />
                            <Flex vertical style={{ marginTop: "10px" }}>
                                <span>
                                    {dayjs
                                        .duration(item.durationSec, "seconds")
                                        .format("HH:mm:ss")}
                                </span>
                                <span>
                                    {(item.distanceMeters / 1000).toFixed(1)} km
                                </span>
                                <span>{item.summary.tss} TSS</span>
                            </Flex>
                        </Card>
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

    return (
        <ConfigProvider locale={enGB}>
            <div className="overflow-x-auto w-full pb-4">
                <div className="min-w-225">
                    <Calendar
                        style={{ minWidth: "900px", marginTop: "40px" }}
                        cellRender={cellRender}
                        headerRender={({ value, onChange }) => (
                            <div className="fixed bg-white top-10 left-0 right-0 z-50 shadow">
                                <div className="h-16 flex items-center p-6">
                                    <Space size="middle">
                                        <Tooltip
                                            title="Select Date"
                                            placement="bottom"
                                        >
                                            <div
                                                style={{
                                                    position: "relative",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Space
                                                    onClick={() =>
                                                        setIsDatePickerOpen(
                                                            true,
                                                        )
                                                    }
                                                    style={{
                                                        cursor: "pointer",
                                                        fontSize: "16px",
                                                        fontWeight: 500,
                                                        width: "150px",
                                                    }}
                                                >
                                                    <span>
                                                        {value.format(
                                                            "MMMM YYYY",
                                                        )}
                                                    </span>
                                                    <DownOutlined
                                                        style={{
                                                            transition: "0.3s",
                                                            transform:
                                                                isDatePickerOpen
                                                                    ? "rotate(180deg)"
                                                                    : "none",
                                                        }}
                                                    />
                                                </Space>
                                                <DatePicker
                                                    open={isDatePickerOpen}
                                                    onOpenChange={(open) =>
                                                        setIsDatePickerOpen(
                                                            open,
                                                        )
                                                    }
                                                    onChange={(date) => {
                                                        if (date) {
                                                            onChange(date);
                                                        }
                                                        setIsDatePickerOpen(
                                                            false,
                                                        );
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
                                        <Tooltip
                                            title="Get to Today"
                                            placement="bottom"
                                        >
                                            <Button
                                                variant="outlined"
                                                onClick={() =>
                                                    onChange(dayjs())
                                                }
                                            >
                                                Today
                                            </Button>
                                        </Tooltip>
                                        <Tooltip
                                            title="Back One month"
                                            placement="bottom"
                                        >
                                            <Button
                                                icon={<LeftOutlined />}
                                                onClick={() =>
                                                    onChange(
                                                        value
                                                            .clone()
                                                            .subtract(
                                                                1,
                                                                "month",
                                                            ),
                                                    )
                                                }
                                            />
                                        </Tooltip>
                                        <Tooltip
                                            title="Forwar One month"
                                            placement="bottom"
                                        >
                                            <Button
                                                icon={<RightOutlined />}
                                                onClick={() =>
                                                    onChange(
                                                        value
                                                            .clone()
                                                            .add(1, "month"),
                                                    )
                                                }
                                            />
                                        </Tooltip>
                                    </Space>
                                </div>
                                <div className="flex w-full border-y border-gray-200 min-w-225">
                                    {getDaysOfWeek().map((day) => (
                                        <div
                                            key={day}
                                            className="flex-1 p-2 px-6 pr-4 text-gray-400 font-medium text-xs uppercase tracking-wider"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    />
                </div>
            </div>
        </ConfigProvider>
    );
};

export default CalendarModule;
