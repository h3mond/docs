import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import {JWT_SECRET} from "../env";
import {Account} from "../models/account.model";
import {LoggerService} from "../services/logger.service";

const passportConfig = passport => {
  passport.use(
    new JWTStrategy({
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (payload, done) => {
      try {
        const account = await Account.findById(payload._id)
        if (account) {
          return done(null, account);
        }
        return done(null, false);
      } catch (e) {
        LoggerService.log.error("Passport failed: ", e.message);
        return done(null, false);
      }
    })
  )
}

export { passportConfig };
