import express from "express";

import auth from "./appRoutes/auth";
import users from "./appRoutes/users";
import activities from "./appRoutes/activities";
import stats from "./appRoutes/stats";
import plannedWorkouts from "./appRoutes/plannedWorkouts";

const router = express.Router();

export default (): express.Router => {
    auth(router);
    users(router);
    activities(router);
    stats(router);
    plannedWorkouts(router);

    return router;
};
