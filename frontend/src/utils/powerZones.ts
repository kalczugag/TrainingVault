export interface PowerZone {
    id: string;
    name: string;
    rangeStr: string;
    min: number;
    max: number | null;
}

export const calculateCogganPowerZones = (ftp: number): PowerZone[] => {
    const z1Max = Math.floor(ftp * 0.55);
    const z2Max = Math.floor(ftp * 0.75);
    const z3Max = Math.floor(ftp * 0.9);
    const z4Max = Math.floor(ftp * 1.05);
    const z5Max = Math.floor(ftp * 1.2);
    const z6Max = Math.floor(ftp * 1.5);

    return [
        {
            id: "Z7",
            name: "Neuromuscular",
            min: z6Max + 1,
            max: null,
            rangeStr: `${z6Max + 1}+ w`,
        },
        {
            id: "Z6",
            name: "Anaerobic",
            min: z5Max + 1,
            max: z6Max,
            rangeStr: `${z5Max + 1} - ${z6Max} w`,
        },
        {
            id: "Z5",
            name: "VO2Max",
            min: z4Max + 1,
            max: z5Max,
            rangeStr: `${z4Max + 1} - ${z5Max} w`,
        },
        {
            id: "Z4",
            name: "Threshold",
            min: z3Max + 1,
            max: z4Max,
            rangeStr: `${z3Max + 1} - ${z4Max} w`,
        },
        {
            id: "Z3",
            name: "Tempo",
            min: z2Max + 1,
            max: z3Max,
            rangeStr: `${z2Max + 1} - ${z3Max} w`,
        },
        {
            id: "Z2",
            name: "Endurance",
            min: z1Max + 1,
            max: z2Max,
            rangeStr: `${z1Max + 1} - ${z2Max} w`,
        },
        {
            id: "Z1",
            name: "Recovery",
            min: 0,
            max: z1Max,
            rangeStr: `0 - ${z1Max} w`,
        },
    ];
};
