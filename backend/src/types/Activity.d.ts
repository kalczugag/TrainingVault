import type { SportType } from "./ActivityStream";

interface Activity {
    _id: string;
    athleteId: string | null;
    garminActivityId: string;
    title: string;
    sportType: SportType;
    startTime: Date;
    durationSec: number;
    distanceMeters: number;
    summary: {
        tss: number;
        np: number;
        if: number;
        workKj: number;
        avgPower: number;
        maxPower: number;
        avgHr: number;
        maxHr: number;
        avgCadence: number;
        elevationGain: number;
    };
    recalculateTss: boolean;
}

export { Activity };
