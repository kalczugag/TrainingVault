import { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/pl";
import enGB from "antd/es/locale/pl_PL";
import duration from "dayjs/plugin/duration";
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
import ActivityModal from "@/components/ActivityModal";
import { current } from "@reduxjs/toolkit";

dayjs.extend(duration);
dayjs.extend(isoWeek);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
    weekstart: 1,
});

const CalendarModule = () => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(() => dayjs());

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
                    <ActivityModal key={item._id} item={item} />
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

    const getWeeklyStatsForMonth = () => {
        const weeks = [];
        let currentIter = currentDate.startOf("month").startOf("isoWeek");
        const endOfMonth = currentDate.endOf("month").endOf("isoWeek");

        while (currentIter.isBefore(endOfMonth)) {
            const weekStart = currentIter.valueOf();
            const weekEnd = currentIter.endOf("isoWeek").valueOf();

            const acts =
                data?.result?.filter((a) => {
                    const t = dayjs(a.startTime).valueOf();
                    return t >= weekStart && t <= weekEnd;
                }) || [];

            const totalTss = acts.reduce(
                (sum, act) => sum + (act.summary?.tss || 0),
                0,
            );
            const totalDistance = acts.reduce(
                (sum, act) => sum + (act.distanceMeters || 0),
                0,
            );
            const totalDuration = acts.reduce(
                (sum, act) => sum + (act.durationSec || 0),
                0,
            );
            const totalHours = Math.floor(totalDuration / 3600);
            const totalMins = Math.floor((totalDuration % 3600) / 60)
                .toString()
                .padStart(2, "0");

            weeks.push({
                id: weekStart,
                label: `${currentIter.format("DD MMM")} - ${currentIter.endOf("isoWeek").format("DD MMM")}`,
                tss: totalTss,
                distance: (totalDistance / 1000).toFixed(1),
                time: `${totalHours}:${totalMins} h`,
                count: acts.length,
            });

            currentIter = currentIter.add(1, "week");
        }
        return weeks;
    };

    const weeklyStats = getWeeklyStatsForMonth();

    return (
        <ConfigProvider locale={enGB}>
            <div className=" relative flex flex-row gap-6 w-full">
                <div className="flex-1 min-w-225 overflow-x-auto">
                    <Calendar
                        style={{ minWidth: "900px", marginTop: "40px" }}
                        value={currentDate}
                        onChange={(date) => setCurrentDate(date)}
                        onPanelChange={(date) => setCurrentDate(date)}
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
                            {weeklyStats.map((week, index) => (
                                <div
                                    key={week.id}
                                    className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                                >
                                    <div className="text-xs text-blue-500 font-bold mb-2">
                                        Week {index + 1}{" "}
                                        <span className="text-gray-400 font-normal">
                                            ({week.label})
                                        </span>
                                    </div>

                                    {week.count > 0 ? (
                                        <Flex
                                            justify="space-between"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            <Flex vertical>
                                                <span className="text-xs text-gray-400">
                                                    Time
                                                </span>
                                                {week.time}
                                            </Flex>
                                            <Flex vertical>
                                                <span className="text-xs text-gray-400">
                                                    Distance
                                                </span>
                                                {week.distance} km
                                            </Flex>
                                            <Flex vertical>
                                                <span className="text-xs text-gray-400">
                                                    TSS
                                                </span>
                                                {week.tss}
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
