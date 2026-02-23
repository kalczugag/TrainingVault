import express from "express";

import auth from "./appRoutes/auth";
import users from "./appRoutes/users";

const router = express.Router();

export default (): express.Router => {
    auth(router);
    users(router);

    return router;
};
