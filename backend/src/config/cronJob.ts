import cron from "node-cron";
import { UserModel } from "../models/User";
import { PlannedWorkoutModel } from "../models/PlannedWorkout";
import { recalculatePMC } from "./pmcService";
import { recalculateWeeklyStats } from "./weeklyStatService";
import type { User } from "../types/User";

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

type UserWorkoutData = { name: string; workouts: any[] };

cron.schedule("0 6 * * *", async () => {
    try {
        const todayStart = new Date();
        todayStart.setUTCHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setUTCHours(23, 59, 59, 999);

        const todaysWorkouts = await PlannedWorkoutModel.find({
            scheduledDate: { $gte: todayStart, $lte: todayEnd },
            status: "scheduled",
        }).populate("athleteId", "email displayName");

        if (todaysWorkouts.length === 0) {
            return;
        }

        const userWorkoutsMap = todaysWorkouts.reduce<
            Record<string, UserWorkoutData>
        >((acc: any, workout) => {
            const user: any = workout.athleteId;
            if (!user) return acc;

            const userEmail = user.email;
            if (!acc[userEmail]) {
                acc[userEmail] = { name: user.displayName, workouts: [] };
            }

            acc[userEmail].workouts.push(workout);

            return acc;
        }, {});

        for (const [email, data] of Object.entries(userWorkoutsMap)) {
            const workoutCount = data.workouts.length;
            const titles = data.workouts.map((w) => w.title).join(", ");

            console.log(`email send to ${email}, planned workout: ${titles}`);
        }
    } catch (err) {
        console.error("Error in cron job", err);
    }
});
