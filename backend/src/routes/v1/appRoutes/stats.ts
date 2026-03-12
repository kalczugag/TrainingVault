import express from "express";
import passport from "passport";

import methods from "../../../controllers/stats";

const stats = (router: express.Router) => {
    router.get(
        "/stats/weekly",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.readWeeklyStats,
    );

    router.post(
        "/stats/recalculate",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.recalculate,
    );
};

export default stats;
