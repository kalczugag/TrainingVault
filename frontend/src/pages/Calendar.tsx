import Loading from "@/components/Loading";
import CalendarModule from "@/modules/CalendarModule";
import { useGetActivitiesQuery } from "@/store";

const Calendar = () => {
    const { data: activities, isLoading: isLoadingActivities } =
        useGetActivitiesQuery({});

    const anythingLoading = isLoadingActivities;

    if (anythingLoading) return <Loading isLoading />;

    return (
        <CalendarModule
            activities={activities!.result}
            isLoading={anythingLoading}
        />
    );
};

export default Calendar;
