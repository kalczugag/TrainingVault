import type { SportType } from "@/constants/activities";
import type { Role, UnitSystem } from "@/constants/user";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: Role;
    primarySport: SportType;
    preferences: UnitSystem;
}

interface AuthState {
    token: string | null;
    user: UserState | null;
    expires: string | null;
}

const initialState: AuthState = {
    token: null,
    user: null,
    expires: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthState>) => {
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                expires: action.payload.expires,
            };
        },

        logOut: (state) => {
            return {
                ...state,
                token: null,
                user: null,
                expires: null,
            };
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
export type { AuthState };
