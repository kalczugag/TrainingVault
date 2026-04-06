import Loading from "@/components/Loading";
import CalendarModule from "@/modules/CalendarModule";
import { useGetActivitiesQuery, useGetWeeklyStatsQuery } from "@/store";
import dayjs from "dayjs";
import { useState } from "react";

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [page, setPage] = useState(1);

    const startDate = currentMonth
        .startOf("month")
        .startOf("isoWeek")
        .toISOString();
    const endDate = currentMonth.endOf("month").endOf("isoWeek").toISOString();

    const {
        data: activitiesData,
        isLoading: isLoadingActivities,
        isFetching: isFetchingActivities,
    } = useGetActivitiesQuery({ page, limit: 50, startDate, endDate });

    const {
        data: weeklyStatsData,
        isLoading: isLoadingWeeklyStats,
        isFetching: isFetchingWeeklyStats,
    } = useGetWeeklyStatsQuery({ page, limit: 10, startDate, endDate });

    const activities = activitiesData?.result || [];
    const weeklyStats = weeklyStatsData?.result || [];

    const isInitialLoading = isLoadingActivities || isLoadingWeeklyStats;
    const isFetchingMore = isFetchingActivities || isFetchingWeeklyStats;

    const handleLoadMoreWeeks = () => {
        if (!isFetchingMore && activitiesData?.hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    if (isInitialLoading && page === 1) return <Loading isLoading />;

    return (
        <CalendarModule
            activities={activities}
            weeklyStats={weeklyStats}
            isLoading={isFetchingMore}
            loadMoreWeeks={handleLoadMoreWeeks}
            currentMonth={currentMonth}
            setCurrentMonth={(date) => {
                setCurrentMonth(date);
                setPage(1);
            }}
        />
    );
};

export default Calendar;
