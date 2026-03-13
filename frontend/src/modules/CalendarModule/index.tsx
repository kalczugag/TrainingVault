import { useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/pl";
import enGB from "antd/es/locale/pl_PL";
import duration from "dayjs/plugin/duration";
import {
    DownOutlined,
    LeftOutlined,
    RightOutlined,
    MenuOutlined,
    DeleteOutlined,
    PlusOutlined,
    ScissorOutlined,
    CopyOutlined,
    SnippetsOutlined,
    SplitCellsOutlined,
} from "@ant-design/icons";
import {
    Button,
    Calendar,
    DatePicker,
    Space,
    Card,
    ConfigProvider,
    Tooltip,
    Flex,
    Dropdown,
} from "antd";
import type { CalendarProps, MenuProps } from "antd";
import ActivityModal from "@/components/ActivityModal";
import type { Activity } from "@/types/Activity";
import type { WeeklyStat } from "@/types/WeeklyStat";

dayjs.extend(duration);
dayjs.extend(isoWeek);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
    weekstart: 1,
});

interface CalendarModuleProps {
    activities: Activity[];
    weeklyStats: WeeklyStat[];
    isLoading: boolean;
}

const CalendarModule = ({
    activities,
    weeklyStats,
    isLoading,
}: CalendarModuleProps) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(() => dayjs());

    const getDaysOfWeek = () => {
        const days = [];
        for (let i = 1; i <= 7; i++) {
            days.push(dayjs().day(i).format("ddd"));
        }
        return days;
    };

    const getListData = (value: Dayjs) => {
        const activitiesForThisDay = activities.filter((activity) =>
            dayjs(activity.startTime).isSame(value, "day"),
        );
        return activitiesForThisDay;
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);

        const currentDate = value.format("YYYY-MM-DD");

        const isActualMonth = value.isSame(dayjs(), "month");
        const isActualWeek = value.isSame(dayjs(), "isoWeek");
        const isToday = value.isSame(dayjs(), "day");

        const isSelected = selectedDate === currentDate;

        const items: MenuProps["items"] = [
            {
                key: "1",
                label: "Add",
                icon: <PlusOutlined />,
                onClick: () => {
                    alert("clicked 1");
                },
            },
            {
                key: "2",
                label: "Cut",
                icon: <ScissorOutlined />,
                onClick: () => {
                    alert("clicked 2");
                },
            },
            {
                key: "3",
                label: "Copy",
                icon: <CopyOutlined />,
                onClick: () => {
                    alert("clicked 3");
                },
            },
            {
                key: "4",
                label: "Paste",
                icon: <SnippetsOutlined />,
                disabled: true,
                onClick: () => {
                    alert("clicked 4");
                },
            },
            {
                key: "5",
                label: "Shift",
                icon: <SplitCellsOutlined />,
                onClick: () => {
                    alert("clicked 5");
                },
            },
            {
                type: "divider",
            },
            {
                key: "6",
                label: "Delete",
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => {
                    alert("clicked 6");
                },
            },
        ];

        //backdrop #BED3FD
        return (
            <div className="relative h-full">
                {isSelected && (
                    <div
                        className="absolute inset-0 z-1 bg-[#9dbeff] w-full h-full opacity-50"
                        onClick={() => setSelectedDate(null)}
                    />
                )}
                <Card
                    size="small"
                    title={
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDate(
                                    isSelected ? null : currentDate,
                                );
                            }}
                        >
                            {isToday && "Today"} {value.format("DD")}
                        </div>
                    }
                    className="group cursor-default"
                    extra={
                        <div
                            className="opacity-0  group-hover:opacity-100 transition-opacity duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Dropdown trigger={["click"]} menu={{ items }}>
                                <Button
                                    icon={
                                        <MenuOutlined
                                            style={{
                                                color: isToday
                                                    ? "#FFF"
                                                    : undefined,
                                            }}
                                        />
                                    }
                                    size="small"
                                    type="text"
                                />
                            </Dropdown>
                        </div>
                    }
                    styles={{
                        root: {
                            backgroundColor: "#FFF",
                            textAlign: "left",
                            border: "none",
                            borderTop: "1px groove",
                            borderRight: "1px groove",
                            borderRadius: 0,
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                        },
                        header: {
                            background:
                                isActualWeek && isToday
                                    ? "#1840EC"
                                    : isActualWeek
                                      ? "#EAECF2"
                                      : "transparent",
                            color:
                                isActualWeek && isToday
                                    ? "#FFF"
                                    : isActualMonth
                                      ? "#061a5a"
                                      : "#C3C9D7",
                            fontWeight: 300,
                            fontSize: "12px",
                            borderRadius: 0,
                            border: "none",
                            minHeight: "unset",
                        },
                        body: {
                            borderRadius: 0,
                            border: "none",
                            padding: "8px",
                            flex: 1,
                            minHeight: "100px",
                        },
                    }}
                >
                    <ul className="group">
                        {listData?.map((item) => (
                            <ActivityModal key={item._id} item={item} />
                        ))}
                        <Button
                            type="text"
                            color="default"
                            variant="outlined"
                            className="w-full opacity-0  group-hover:opacity-100 transition-opacity duration-200"
                        >
                            <PlusOutlined />
                        </Button>
                    </ul>
                </Card>
            </div>
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
            <div className=" relative flex flex-row gap-6 w-full">
                <div className="flex-1 min-w-225 overflow-x-auto">
                    <Calendar
                        style={{ minWidth: "900px", marginTop: "41px" }}
                        value={currentDate}
                        onChange={(date) => setCurrentDate(date)}
                        onPanelChange={(date) => setCurrentDate(date)}
                        fullCellRender={cellRender}
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
                                                onClick={() => {
                                                    setSelectedDate(null);
                                                    onChange(dayjs());
                                                }}
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
                                                onClick={() => {
                                                    setSelectedDate(null);
                                                    onChange(
                                                        value
                                                            .clone()
                                                            .subtract(
                                                                1,
                                                                "month",
                                                            ),
                                                    );
                                                }}
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
                                    {[...getDaysOfWeek(), "Summary"].map(
                                        (day) => (
                                            <div
                                                key={day}
                                                className="flex-1 p-2 px-6 pr-4 text-gray-400 font-medium text-xs uppercase tracking-wider"
                                            >
                                                {day}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    />
                </div>

                {/* Weekly stats design to change  */}
                <div className="w-[320px] shrink-0">
                    <Card
                        title={`Summary: ${currentDate.format("MMMM")}`}
                        style={{
                            position: "sticky",
                            top: "150px",
                        }}
                        className="shadow-sm"
                    >
                        <Flex vertical gap="large">
                            {weeklyStats.map((stat, index) => (
                                <div
                                    key={stat._id}
                                    className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                                >
                                    <div className="text-xs text-blue-500 font-bold mb-2">
                                        Week {index + 1}{" "}
                                        <span className="text-gray-400 font-normal">
                                            (
                                            {dayjs(
                                                stat.weekStartDate.toString(),
                                            ).format("DD MMMM")}{" "}
                                            -{" "}
                                            {dayjs(
                                                stat.weekEndDate.toString(),
                                            ).format("DD MMMM")}
                                            )
                                        </span>
                                    </div>

                                    {stat.activityCount > 0 ? (
                                        <Flex
                                            justify="space-between"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            <Flex vertical>
                                                <span className="text-xs text-gray-400">
                                                    Time
                                                </span>
                                                {`${Math.floor(stat.totalDurationSec / 3600)}:${Math.floor(
                                                    (stat.totalDurationSec %
                                                        3600) /
                                                        60,
                                                )
                                                    .toString()
                                                    .padStart(2, "0")} hms`}
                                            </Flex>
                                            <Flex vertical>
                                                <span className="text-xs text-gray-400">
                                                    Distance
                                                </span>
                                                {(
                                                    stat.totalDistanceMeters /
                                                    1000
                                                ).toFixed(2)}{" "}
                                                km
                                            </Flex>
                                            <Flex vertical>
                                                <span className="text-xs text-gray-400">
                                                    TSS
                                                </span>
                                                {stat.totalTss}
                                            </Flex>
                                        </Flex>
                                    ) : (
                                        <div className="text-xs text-gray-300 italic">
                                            No Activities
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Flex>
                    </Card>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default CalendarModule;
