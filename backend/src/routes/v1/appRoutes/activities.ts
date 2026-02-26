import express from "express";
import passport from "passport";

import methods from "../../../controllers/activities";
import { syncLimiter } from "../../../middlewares/rateLimiter";

const activities = (router: express.Router) => {
    router.get(
        "/activities",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.read,
    );

    router.get(
        "/activities/sync",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        syncLimiter,
        methods.readAndSave,
    );

    router.post(
        "/activities/:dbActivityId/sync-stream",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.syncStream,
    );
};

export default activities;
