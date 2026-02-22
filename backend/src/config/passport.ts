import passport from "passport";
import {
    ExtractJwt,
    Strategy as JWTStrategy,
    StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { UserModel } from "../models/User";
import { RoleModel } from "../models/Role";

const opts: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
    algorithms: ["HS256"],
};

passport.use(
    new JWTStrategy(opts, async (payload, done) => {
        try {
            const user = await UserModel.findById(payload.sub);

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }),
);
