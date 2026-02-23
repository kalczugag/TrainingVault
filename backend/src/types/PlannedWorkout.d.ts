import type {
    DurationType,
    StepType,
    TargetType,
    Status,
    SportType,
} from "../constants/activities";

interface WorkoutStep {
    stepOrder: number;
    type: StepType;
    duration: {
        type: DurationType;
        value: number;
    };
    target: {
        type: TargetType;
        min: number;
        max: number;
        isRamp?: boolean;
        startValue: number;
        endValue: number;
    };
}

interface PlannedWorkout {
    _id: string;
    athleteId: string | null;
    createdBy: string | null;
    scheduledDate: Date;
    title: string;
    sportType: SportType;
    targetTss: number;
    status: Status;
    structure: WorkoutStep;
}

export { PlannedWorkout, WorkoutStep };
