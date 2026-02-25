interface DailyStat {
    _id: string;
    athleteId: string | null;
    date: Date;
    dailyTss: number;
    dailyWorkKj: number;
    dailyDurationSec: number;
    dailyElevationGain: number;
    dailyDistanceMeters: number;
    ctl: number;
    atl: number;
    tsb: number;
}

export { DailyStat };
