import { apiSlice } from "./apiSlice";
import type { Activity } from "@/types/Activity";

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
    }),
});

export const { useGetActivitiesQuery } = activitiesApi;
