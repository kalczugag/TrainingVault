import type { Role } from "../constants/user";

interface User {
    _id: string;
    email: string;
    role: Role;
    coachId?: string;
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
