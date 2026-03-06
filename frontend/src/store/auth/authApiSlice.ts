import { apiSlice } from "../apis/apiSlice";
import { logOut, setCredentials } from "./authSlice";
import type { FieldType as LoginInput } from "@/forms/LoginForm";
import type { FieldType as RegisterInput } from "@/forms/RegisterForm";
import type { UserState } from "./authSlice";

type AuthResult = {
    expires: string;
    success: boolean;
    user: UserState;
    token: string;
};

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResult, LoginInput>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: { ...credentials },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        setCredentials({
                            token: data.token,
                            user: data.user,
                            expires: data.expires,
                        }),
                    );
                } catch (err) {
                    console.error("Login error", err);
                }
            },
        }),

        register: builder.mutation<
            AuthResult,
            Omit<RegisterInput, "birthDate" | "fullName"> & {
                firstName: string;
                lastName: string;
                birthDate: Date;
                garminCredentials?: {
                    email: string;
                    password: string;
                };
            }
        >({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: { ...data },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        setCredentials({
                            token: data.token,
                            user: data.user,
                            expires: data.expires,
                        }),
                    );
                } catch (err) {
                    console.error("Register error", err);
                }
            },
        }),

        refreshToken: builder.query<AuthResult, void>({
            query: () => ({
                url: "/auth/refresh",
                method: "GET",
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(
                        setCredentials({
                            token: data.token,
                            user: data.user,
                            expires: data.expires,
                        }),
                    );
                } catch (err) {
                    console.error("Refresh token error", err);
                }
            },
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "GET",
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logOut());
                } catch (err) {
                    console.error("Logout error", err);
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useRefreshTokenQuery,
    useRegisterMutation,
    useLogoutMutation,
} = authApiSlice;
