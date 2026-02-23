interface DailyStat {
    _id: string;
    athleteId: string | null;
    date: Date;
    dailyTss: number;
    pmc: {
        ctl: number;
        atl: number;
        tsb: number;
    };
}

export { DailyStat };
