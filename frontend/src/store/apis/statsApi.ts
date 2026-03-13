import { apiSlice } from "./apiSlice";
import type { WeeklyStat } from "@/types/WeeklyStat";

export const statsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWeeklyStats: builder.query<ApiResponseArray<WeeklyStat>, Paginate>({
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
                    url: "/stats/weekly",
                    method: "GET",
                    params: queryParams,
                };
            },
        }),
    }),
});

export const { useGetWeeklyStatsQuery } = statsApi;
