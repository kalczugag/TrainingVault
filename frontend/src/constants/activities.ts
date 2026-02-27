export const STATUS = [
    "scheduled",
    "completed",
    "missed",
    "cancelled",
] as const;

export const SPORT_TYPES = [
    "running",
    "cycling",
    "swimming",
    "triathlon",
] as const;

export const STEP_TYPES = [
    "warmup",
    "active",
    "recovery",
    "cooldown",
    "interval",
    "repeat",
    "freeform",
    "other",
] as const;

export const DURATION_TYPES = [
    "time",
    "distance",
    "lap_button",
    "iterations",
] as const;

export const TARGET_TYPES = [
    "power_percent",
    "hr_percent",
    "cadence",
    "none",
] as const;

export type Status = (typeof STATUS)[number];
export type SportType = (typeof SPORT_TYPES)[number];
export type StepType = (typeof STEP_TYPES)[number];
export type DurationType = (typeof DURATION_TYPES)[number];
export type TargetType = (typeof TARGET_TYPES)[number];
