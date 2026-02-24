import express from "express";

import auth from "./appRoutes/auth";
import users from "./appRoutes/users";
import activities from "./appRoutes/activities";

const router = express.Router();

export default (): express.Router => {
    auth(router);
    users(router);
    activities(router);

    return router;
};
