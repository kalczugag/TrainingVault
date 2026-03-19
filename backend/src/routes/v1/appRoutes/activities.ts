import express from "express";
import passport from "passport";
import multer from "multer";

import methods from "../../../controllers/activities";
import { syncLimiter } from "../../../middlewares/rateLimiter";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
});

const activities = (router: express.Router) => {
    router.get(
        "/activities",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.read,
    );

    router.get(
        "/activities/:activityId",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.readById,
    );

    router.get(
        "/activities/sync",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        syncLimiter,
        methods.readAndSave,
    );

    router.get(
        "/activities/:id/export/:format",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.export,
    );

    router.post(
        "/activities/:dbActivityId/sync-stream",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.syncStream,
    );

    router.post(
        "/activities/upload",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        upload.array("files", 100),
        methods.upload,
    );
};

export default activities;
