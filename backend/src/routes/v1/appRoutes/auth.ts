import express from "express";
import passport from "passport";

import methods from "../../../controllers/auth";
import { authLimiter } from "../../../middlewares/rateLimiter";

const auth = (router: express.Router) => {
    router.get(
        "/auth/current_user",
        passport.authenticate(["jwt"], {
            session: false,
        }),
        methods.readCurrentUser,
    );

    router.get("/auth/refresh", methods.refreshToken);

    router.get("/auth/logout", methods.logout);

    router.post("/auth/login", authLimiter, methods.login);

    router.post("/auth/register", authLimiter, methods.register);
};

export default auth;
