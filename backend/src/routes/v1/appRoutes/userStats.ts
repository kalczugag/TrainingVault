import express from "express";
import passport from "passport";

import methods from "../../../controllers/efforts";

const strava = (router: express.Router) => {
    router.post(
        "/recalculate-stats",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.recalculateUserStats,
    );
};

export default strava;
