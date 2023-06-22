import JwtPassport from 'passport-jwt';
import dotenv from 'dotenv';
dotenv.config({
    path: require('path').resolve(__dirname, '../.env')
});

//Database Model
import { UserModel } from '../database/user';

const JWTStrategy = JwtPassport.Strategy;
const ExtractJWT = JwtPassport.ExtractJwt;

const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

export default (passport) => {
    passport.use(
        new JWTStrategy(options, async (jwt__payload, done) => {
            try{
                const doesUserExist = UserModel.findById(jwt__payload.user);
                if(!doesUserExist) return done(null, false);
                return done(null, doesUserExist);
            } catch(error){
                throw new Error(error);
            }
        })
    )
};
