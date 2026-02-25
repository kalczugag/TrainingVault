interface WeeklyStat {
    athleteId: string | null;
    weekStartDate: Date;
    weekEndDate: Date;
    totalTss: number;
    totalDistanceMeters: number;
    totalDurationSec: number;
    totalWorkKj: number;
    activityCount: number;
    distancePerSport: {
        cycling: number;
        running: number;
        swimming: number;
    };
    endingCtl: number;
}

export { WeeklyStat };
