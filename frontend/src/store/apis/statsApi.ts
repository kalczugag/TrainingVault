import { apiSlice } from "./apiSlice";
import type { WeeklyStat } from "@/types/WeeklyStat";

export const statsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWeeklyStats: builder.query<ApiResponseArray<WeeklyStat>, Paginate>({
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
                    url: "/stats/weekly",
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
                    ? data.result.map((stat) => ({
                          type: "WeeklyStat",
                          id: stat._id,
                      }))
                    : [{ type: "WeeklyStat", id: "LIST" }],
        }),
    }),
});

export const { useGetWeeklyStatsQuery } = statsApi;
