export const USER_ROLES = ["athlete", "coach"] as const;

export const UNIT_SYSTEMS = ["metric", "imperial"] as const;

export const START_OF_WEEK_OPTIONS = ["sunday", "monday"] as const;

export const CALCULATION_METHODS = ["custom", "maxHr", "hrr", "ftp"] as const;

export type Role = (typeof USER_ROLES)[number];
export type UnitSystem = (typeof UNIT_SYSTEMS)[number];
export type StartOfWeek = (typeof START_OF_WEEK_OPTIONS)[number];
export type CalculationMethod = (typeof CALCULATION_METHODS)[number];
