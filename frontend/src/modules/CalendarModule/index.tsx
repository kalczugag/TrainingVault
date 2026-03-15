import { useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/pl";
import enGB from "antd/es/locale/pl_PL";
import duration from "dayjs/plugin/duration";
import { Calendar, ConfigProvider } from "antd";
import type { CalendarProps } from "antd";
import type { Activity } from "@/types/Activity";
import type { WeeklyStat } from "@/types/WeeklyStat";
import CellItem from "./components/CellItem";
import CalendarHeader from "./components/CalendarHeader";
import WeeklyStatsCard from "./components/WeeklyStatsCard";

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
    const [currentDate, setCurrentDate] = useState(() => dayjs());

    const getListData = (value: Dayjs) => {
        const activitiesForThisDay = activities.filter((activity) =>
            dayjs(activity.startTime).isSame(value, "day"),
        );
        return activitiesForThisDay;
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);

        return CellItem({ value, listData, selectedDate, setSelectedDate });
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
                            <CalendarHeader
                                value={value}
                                onChange={onChange}
                                setSelectedDate={setSelectedDate}
                            />
                        )}
                    />
                </div>

                {/* Weekly stats design to change  */}
                <WeeklyStatsCard
                    currentDate={currentDate}
                    weeklyStats={weeklyStats}
                />
            </div>
        </ConfigProvider>
    );
};

export default CalendarModule;
