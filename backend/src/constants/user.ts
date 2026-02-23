export const USER_ROLES = ["athlete", "coach"] as const;

export type Role = (typeof USER_ROLES)[number];
