import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../auth/authSlice";
import type { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import type { RootState } from "..";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl:
        import.meta.env.MODE === "production"
            ? import.meta.env.VITE_BACKEND_SERVER + "/api/v1"
            : window.location.protocol +
              "//" +
              window.location.host +
              "/api/v1",

    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth.token;

        if (token) {
            headers.set("authorization", token);
        }

        return headers;
    },
});

const baseQueryWithReauth = async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: any,
) => {
    await mutex.waitForUnlock();

    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403 || result?.error?.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                const refreshResult = await baseQuery(
                    "/auth/refresh",
                    api,
                    extraOptions,
                );

                if (refreshResult?.data) {
                    const state = api.getState() as RootState;
                    const refreshData = refreshResult.data as {
                        token: string;
                        expires: string;
                        isAdmin?: boolean;
                    };

                    api.dispatch(
                        setCredentials({
                            token: refreshData.token,
                            isAdmin:
                                refreshData.isAdmin !== undefined
                                    ? refreshData.isAdmin
                                    : state.auth.isAdmin,
                            expires: refreshData.expires,
                        }),
                    );
                } else {
                    api.dispatch(logOut());
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();

            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({}),
    tagTypes: [],
});
