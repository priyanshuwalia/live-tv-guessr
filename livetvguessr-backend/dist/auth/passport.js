"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/auth/passport.ts
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const db_1 = require("../db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
passport_1.default.use(new passport_jwt_1.Strategy(options, async (jwtPayload, done) => {
    try {
        // jwtPayload contains whatever we put in it when we sign the token (usually the user ID)
        const user = await db_1.prisma.user.findUnique({
            where: { id: jwtPayload.id },
        });
        if (user) {
            // Strip the password hash before attaching to req.user for safety
            const { passwordHash, ...userWithoutPassword } = user;
            return done(null, userWithoutPassword);
        }
        return done(null, false);
    }
    catch (error) {
        return done(error, false);
    }
}));
exports.default = passport_1.default;
