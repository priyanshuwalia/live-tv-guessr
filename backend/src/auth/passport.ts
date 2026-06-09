// src/auth/passport.ts
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { prisma } from '../db';
import dotenv from 'dotenv';

dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
        try {
            // jwtPayload contains whatever we put in it when we sign the token (usually the user ID)
            const user = await prisma.user.findUnique({
                where: { id: jwtPayload.id },
            });

            if (user) {
                // Strip the password hash before attaching to req.user for safety
                const { passwordHash, ...userWithoutPassword } = user;
                return done(null, userWithoutPassword);
            }

            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

export default passport;