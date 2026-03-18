interface ActivityStream {
    timestamp: Date;
    metadata: {
        activityId: string;
        athleteId: string;
    };
    measurements: {
        watts: number;
        hr: number;
        cadence: number;
        speedKmh: number;
        altitude: number;
        lat: number;
        lng: number;
    };
}

export { ActivityStream };
