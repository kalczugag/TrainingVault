import express from "express";
import passport from "passport";

import methods from "../../../controllers/strava";

const strava = (router: express.Router) => {
    router.get(
        "/strava/auth-url",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.readStravaAuthUrl,
    );

    router.post(
        "/strava/callback",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.connectStrava,
    );

    router.get("/webhook/strava", methods.verifyStravaWebhook);

    router.post("/webhook/strava", methods.stravaWebhook);
};

export default strava;
