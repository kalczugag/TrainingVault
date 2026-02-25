import cron from "node-cron";
import { UserModel } from "../models/User";
import { recalculatePMC } from "./pmcService";
import { recalculateWeeklyStats } from "./weeklyStatService";

cron.schedule("5 0 * * *", async () => {
    try {
        const users = await UserModel.find({}, "_id").lean();

        for (const user of users) {
            await recalculatePMC(user._id.toString(), new Date());
        }
    } catch (err) {
        console.error("Error in cron job", err);
    }
});

cron.schedule("10 0 * * 1", async () => {
    try {
        const users = await UserModel.find({}, "_id").lean();

        for (const user of users) {
            const today = new Date();

            today.setUTCDate(today.getUTCDate() - 7);

            await recalculateWeeklyStats(user._id.toString(), today);
        }
    } catch (err) {
        console.error("Error in cron job", err);
    }
});
