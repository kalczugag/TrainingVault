import type { Role } from "../constants/user";
import { SportType } from "../constants/activities";

interface User {
    _id: string;
    email: string;
    role: Role;
    coachId?: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    username: string;
    primarySport: SportType;
    garminCredentials: {
        email: string;
        passwordEncrypted: string;
        iv: string;
    };
    metrics: {
        weightKg: number;
        maxHr: number;
        restHr: number;
    };
    thresholdHistory: {
        effectiveFrom: Date;
        ftp: number;
        lthr: number;
    }[];
    hash: string;
    salt: string;
    refreshToken: {
        token: string;
        expires: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export { User };
