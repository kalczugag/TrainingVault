import express from "express";
import passport from "passport";

import methods from "../../../controllers/plannedWorkouts";
import { validatePlannedWorkout } from "../../../middlewares/validatePlannedWorkout";

const plannedWorkouts = (router: express.Router) => {
    router.get(
        "/planned-workouts",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.read,
    );

    router.get(
        "/planned-workouts/:id/export/:format",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.export,
    );

    router.post(
        "/planned-workouts",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        validatePlannedWorkout,
        methods.create,
    );

    router.put(
        "/planned-workouts/:id",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        validatePlannedWorkout,
        methods.update,
    );

    router.delete(
        "/planned-workouts/:id",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.delete,
    );
};

export default plannedWorkouts;
