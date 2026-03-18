import { apiSlice } from "./apiSlice";
import type { Activity } from "@/types/Activity";
import type { ActivityStream } from "@/types/ActivityStream";

export const activitiesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getActivities: builder.query<ApiResponseArray<Activity>, Paginate>({
            query: (params = {}) => {
                const { page, limit } = params;

                let queryParams: Record<string, string> = {};

                if (page !== undefined) {
                    queryParams.page = page.toString();
                }
                if (limit !== undefined) {
                    queryParams.limit = limit.toString();
                }

                return {
                    url: "/activities",
                    method: "GET",
                    params: queryParams,
                };
            },
        }),

        getActivityStream: builder.query<
            ApiResponseArray<ActivityStream>,
            { dbActivityId: string; garminActivityId: string }
        >({
            query: ({ dbActivityId, garminActivityId }) => ({
                url: `/activities/${dbActivityId}/sync-stream`,
                method: "POST",
                body: { garminActivityId },
            }),
        }),
    }),
});

export const { useGetActivitiesQuery, useGetActivityStreamQuery } =
    activitiesApi;
