import Loading from "@/components/Loading";
import CalendarModule from "@/modules/CalendarModule";
import { useGetActivitiesQuery, useGetWeeklyStatsQuery } from "@/store";

const Calendar = () => {
    const { data: activities, isLoading: isLoadingActivities } =
        useGetActivitiesQuery({});
    const { data: weeklyStats, isLoading: isLoadingWeeklyStats } =
        useGetWeeklyStatsQuery({ limit: 5 });

    const anythingLoading = isLoadingActivities || isLoadingWeeklyStats;

    if (anythingLoading) return <Loading isLoading />;

    return (
        <CalendarModule
            activities={activities!.result}
            weeklyStats={weeklyStats!.result}
            isLoading={anythingLoading}
        />
    );
};

export default Calendar;
