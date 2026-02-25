import cron from "node-cron";
import { UserModel } from "../models/User";
import { recalculatePMC } from "../config/pmcService";

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
