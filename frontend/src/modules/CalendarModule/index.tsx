import { useMemo, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import dayjs, { type Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import {
    Button,
    Dropdown,
    Spin,
    Table,
    type GetProp,
    type MenuProps,
    type TableProps,
} from "antd";
import type { Activity } from "@/types/Activity";
import type { WeeklyStat } from "@/types/WeeklyStat";
import CalendarHeader from "./components/CalendarHeader";
import CellItem from "./components/CellItem";
import {
    generateCalendarGrid,
    type WeekRowType,
    type DayData,
} from "@/utils/calendarUtils";
import WeeklyStatsCard from "./components/WeeklyStatsCard";
import {
    CopyOutlined,
    DeleteOutlined,
    MoreOutlined,
    ScissorOutlined,
    SnippetsOutlined,
    SplitCellsOutlined,
} from "@ant-design/icons";

dayjs.extend(duration);

type ColumnsType<T extends object> = GetProp<TableProps<T>, "columns">;

interface CalendarModuleProps {
    activities: Activity[];
    weeklyStats: WeeklyStat[];
    isLoading: boolean;
    currentMonth: Dayjs;
    loadMoreWeeks: (direction: "up" | "down") => void;
    setCurrentMonth: (date: Dayjs) => void;
}

const CalendarModule = ({
    activities,
    weeklyStats,
    isLoading,
    currentMonth,
    loadMoreWeeks,
    setCurrentMonth,
}: CalendarModuleProps) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const viewStartDate = currentMonth.startOf("month");
    const viewEndDate = currentMonth.endOf("month");

    const groupedWeeks = useMemo(() => {
        return generateCalendarGrid(
            activities,
            weeklyStats,
            viewStartDate,
            viewEndDate,
        );
    }, [activities, weeklyStats, viewStartDate, viewEndDate]);

    const { ref: topRef, inView: isTopInView } = useInView({
        rootMargin: "200px",
    });
    const { ref: bottomRef, inView: isBottomInView } = useInView({
        rootMargin: "200px",
    });

    useEffect(() => {
        if (isTopInView && !isLoading) {
            loadMoreWeeks("up");
        }
    }, [isTopInView, isLoading, loadMoreWeeks]);

    useEffect(() => {
        if (isBottomInView && !isLoading) {
            loadMoreWeeks("down");
        }
    }, [isBottomInView, isLoading, loadMoreWeeks]);

    const daysOfWeek = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: "Cut",
            icon: <ScissorOutlined />,
            onClick: () => {
                alert("clicked 2");
            },
        },
        {
            key: "2",
            label: "Copy",
            icon: <CopyOutlined />,
            onClick: () => {
                alert("clicked 3");
            },
        },
        {
            key: "3",
            label: "Paste",
            icon: <SnippetsOutlined />,
            disabled: true,
            onClick: () => {
                alert("clicked 4");
            },
        },
        {
            key: "4",
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
            key: "5",
            label: "Delete",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
                alert("clicked 6");
            },
        },
    ];

    const columns: ColumnsType<WeekRowType> = [
        ...daysOfWeek.map((day) => ({
            dataIndex: day,
            key: day,
            className: "!p-0 align-top !h-[1px]",
            render: (dayData: DayData) => (
                <CellItem
                    value={dayData.date}
                    listData={dayData.activities}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    currentMonth={currentMonth}
                />
            ),
        })),
        {
            key: "spacer",
            width: 32,
            className: "",
            render: () => (
                <div className="h-full w-full flex justify-center">
                    <Dropdown trigger={["click"]} menu={{ items }}>
                        <Button icon={<MoreOutlined />} type="text" />
                    </Dropdown>
                </div>
            ),
        },
        {
            dataIndex: "summary",
            key: "summary",
            width: 240,
            className: "!p-0 align-top !h-[1px]",
            render: (summary: WeeklyStat | null) => (
                <WeeklyStatsCard summary={summary} />
            ),
        },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-white w-full">
            <div className="flex-none bg-white z-10 border-b border-gray-200">
                <CalendarHeader
                    value={currentMonth}
                    onChange={setCurrentMonth}
                    setSelectedDate={setSelectedDate}
                />
            </div>
            <div className="flex-1 overflow-y-auto relative">
                <div ref={topRef} className="h-1 w-full absolute top-0" />
                <Table<WeekRowType>
                    tableLayout="fixed"
                    bordered
                    showHeader={false}
                    pagination={false}
                    rowKey="key"
                    rowHoverable={false}
                    columns={columns}
                    dataSource={groupedWeeks}
                    styles={{
                        body: {
                            cell: {
                                padding: 0,
                                alignContent: "start",
                                height: "100%",
                            },
                        },
                    }}
                />
                <div
                    ref={bottomRef}
                    className="h-14 w-full flex items-center justify-center"
                >
                    {isLoading && <Spin />}
                </div>
            </div>
        </div>
    );
};

export default CalendarModule;
