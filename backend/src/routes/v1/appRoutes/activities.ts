import express from "express";
import passport from "passport";

import methods from "../../../controllers/activities";

const activities = (router: express.Router) => {
    router.get(
        "/activities/sync",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.readAndSave,
    );
};

export default activities;
