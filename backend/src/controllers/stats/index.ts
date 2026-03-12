import { recalculateDailyAndWeeklyStats } from "./recalculate";
import { readWeeklyStats } from "./readWeeklyStats";

const methods = {
    readWeeklyStats,
    recalculate: recalculateDailyAndWeeklyStats,
};

export default methods;
