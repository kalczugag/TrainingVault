import type { SportType } from "./ActivityStream";

interface Activity {
    _id: string;
    athleteId: string | null;
    garminActivityId: string;
    title: string;
    manufacturer: string;
    sportType: SportType;
    startTime: Date;
    durationSec: number;
    distanceMeters: number;
    summary: {
        tss: number;
        np: number;
        if: number;
        workKj: number;
        calories: number;
        trainingLoad: number;
        aerobicTe: number;
        anaerobicTe: number;
        avgHr: number;
        maxHr: number;
        avgPower: number;
        maxPower: number;
        max20MinPower: number;
        avgCadence: number;
        maxCadence: number;
        avgSpeed: number;
        maxSpeed: number;
        elevationGain: number;
        elevationLoss: number;
        powerCurve: {
            p1s: number;
            p2s: number;
            p5s: number;
            p10s: number;
            p20s: number;
            p30s: number;
            p60s: number;
            p120s: number;
            p300s: number;
            p600s: number;
            p1200s: number;
            p1800s: number;
            p3600s: number;
        };
        timeInZones: {
            // in seconds
            hr: number[]; // [z1, z2, z3, z4, z5]
            power: number[]; // [z1, z2, z3, z4, z5, z6, z7]
        };
    };
    recalculateTss: boolean;
}

export { Activity };
