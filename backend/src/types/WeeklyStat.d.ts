import mongoose from "mongoose";

interface WeeklyStat {
    _id: string;
    athleteId: string | null;
    weekStartDate: Date;
    weekEndDate: Date;
    totalTss: number;
    totalDistanceMeters: number;
    totalDurationSec: number;
    totalWorkKj: number;
    totalElevationGain: number;
    endingAtl: number;
    endingTsb: number;
    endingCtl: number;
    activityCount: number;
    distancePerSport: {
        cycling: number;
        running: number;
        swimming: number;
    };
    durationPerSport: {
        cycling: number;
        running: number;
        swimming: number;
    };
    endingCtl: number;
}

export { WeeklyStat };
