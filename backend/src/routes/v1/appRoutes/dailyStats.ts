import express from "express";
import passport from "passport";

import methods from "../../../controllers/dailyStats";

const dailyStats = (router: express.Router) => {
    router.post(
        "/stats/recalculate",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.recalculate,
    );
};

export default dailyStats;
