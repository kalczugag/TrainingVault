import express from "express";
import passport from "passport";

import methods from "../../../controllers/plannedWorkouts";

const plannedWorkouts = (router: express.Router) => {
    router.get(
        "/planned-workouts",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.read,
    );

    router.post(
        "/planned-workouts",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.create,
    );

    router.put(
        "/planned-workouts/:id",
        passport.authenticate(["jwt"], {
            session: false,
        }),
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
