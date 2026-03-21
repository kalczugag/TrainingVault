import type {
    Role,
    UnitSystem,
    StartOfWeek,
    CalculationMethod,
} from "../constants/user";
import type { SportType } from "../constants/activities";

interface ZoneItem {
    name: string;
    min: number;
    max: number;
}

interface ZoneConfig {
    isCustom: boolean;
    calculationMethod: CalculationMethod;
    zones: ZoneItem[];
}

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
    gender: "male" | "female";
    garminCredentials: {
        email: string;
        passwordEncrypted: string;
        iv: string;
    };
    stravaCredentials: {
        stravaAccessToken: string;
        stravaRefreshToken: string;
        stravaTokenExpiresAt: number;
    };
    stravaId: string;
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
    zones: {
        hr: ZoneConfig;
        power: ZoneConfig;
    };
    preferences: {
        unitSystem: UnitSystem;
        startOfWeek: StartOfWeek;
    };
    hash: string;
    salt: string;
    refreshToken: {
        token: string;
        expires: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export { User, ZoneConfig, ZoneItem };
