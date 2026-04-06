import { apiSlice } from "./apiSlice";
import type { Activity } from "@/types/Activity";
import type { ActivityStream } from "@/types/ActivityStream";

export const activitiesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getActivities: builder.query<ApiResponseArray<Activity>, Paginate>({
            query: (params = {}) => {
                const { page, limit, startDate, endDate } = params;

                let queryParams: Record<string, string> = {};

                if (page !== undefined) {
                    queryParams.page = page.toString();
                }
                if (limit !== undefined) {
                    queryParams.limit = limit.toString();
                }
                if (startDate) {
                    queryParams.startDate = startDate.toString();
                }
                if (endDate) {
                    queryParams.endDate = endDate.toString();
                }

                return {
                    url: "/activities",
                    method: "GET",
                    params: queryParams,
                };
            },

            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                const { startDate, endDate } = queryArgs;
                return `${endpointName}-${startDate || "all"}-${endDate || "all"}`;
            },

            merge: (currentCache, newItems) => {
                currentCache.result.push(...newItems.result);

                if (newItems.hasMore !== undefined)
                    currentCache.hasMore = newItems.hasMore;
                if (newItems.nextCursor !== undefined)
                    currentCache.nextCursor = newItems.nextCursor;
                if (newItems.count !== undefined)
                    currentCache.count = newItems.count;
            },

            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            },

            providesTags: (data) =>
                data
                    ? data.result.map((activity) => ({
                          type: "Activity",
                          id: activity._id,
                      }))
                    : [{ type: "Activity", id: "LIST" }],
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

        deleteActivity: builder.mutation<ApiResponseObject<Activity>, string>({
            query: (activityId) => ({
                url: `/activities/${activityId}`,
                method: "DELETE",
            }),

            invalidatesTags: (result, error, activityId) => [
                { type: "Activity", id: activityId },
            ],
        }),
    }),
});

export const {
    useGetActivitiesQuery,
    useGetActivityStreamQuery,
    useDeleteActivityMutation,
} = activitiesApi;
