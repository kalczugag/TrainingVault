interface Effort {
    value: number;
    activityId: string | null;
    garminActivityId: string;
    date: Date;
}

interface UserStat {
    athleteId: string | null;
    cycling: {
        powerCurve: { [key: string]: any[] };
        distances: { [key: string]: any[] };
        elevation: {
            biggestClimb: any[];
            maxElevationGain: any[];
        };
        longestRide: any[];
    };
}

export { UserStat, Effort };
