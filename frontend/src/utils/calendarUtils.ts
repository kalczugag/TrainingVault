import dayjs, { type Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import type { Activity } from "@/types/Activity";
import type { WeeklyStat } from "@/types/WeeklyStat";

dayjs.extend(isoWeek);

export interface DayData {
    date: Dayjs;
    activities: Activity[];
}

export interface WeekRowType {
    key: string;
    monday: DayData;
    tuesday: DayData;
    wednesday: DayData;
    thursday: DayData;
    friday: DayData;
    saturday: DayData;
    sunday: DayData;
    summary: WeeklyStat | null;
}

export const generateCalendarGrid = (
    activities: Activity[],
    weeklyStats: WeeklyStat[],
    startDate: Dayjs,
    endDate: Dayjs,
): WeekRowType[] => {
    const activitiesByDate: Record<string, Activity[]> = {};

    activities.forEach((activity) => {
        const dateKey = dayjs(activity.startTime).format("YYYY-MM-DD");

        if (!activitiesByDate[dateKey]) {
            activitiesByDate[dateKey] = [];
        }

        activitiesByDate[dateKey].push(activity);
    });

    const statsByWeek: Record<string, WeeklyStat> = {};

    weeklyStats.forEach((stat) => {
        const weekKey = dayjs(stat.weekStartDate)
            .startOf("isoWeek")
            .format("YYYY-MM-DD");
        statsByWeek[weekKey] = stat;
    });

    const gridStart = startDate.startOf("isoWeek");
    const gridEnd = endDate.endOf("isoWeek");

    const weeks: WeekRowType[] = [];
    let currentWeekStart = gridStart;

    while (
        currentWeekStart.isBefore(gridEnd) ||
        currentWeekStart.isSame(gridEnd, "day")
    ) {
        const currentWeekDateString = currentWeekStart.format("YYYY-MM-DD");
        const weekKey = `week-${currentWeekDateString}`;

        const buildDay = (dayOffset: number): DayData => {
            const date = currentWeekStart.add(dayOffset, "day");
            const dateKey = date.format("YYYY-MM-DD");

            return { date, activities: activitiesByDate[dateKey] || [] };
        };

        weeks.push({
            key: weekKey,
            monday: buildDay(0),
            tuesday: buildDay(1),
            wednesday: buildDay(2),
            thursday: buildDay(3),
            friday: buildDay(4),
            saturday: buildDay(5),
            sunday: buildDay(6),
            summary: statsByWeek[currentWeekDateString] || null,
        });

        currentWeekStart = currentWeekStart.add(1, "week");
    }

    return weeks;
};
