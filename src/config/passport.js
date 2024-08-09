const passport = require('passport');
const passportJwt = require('passport-jwt');

const { Strategy, ExtractJwt } = passportJwt;

const secret = 'Segredo!'; //segredo deve estar no .env

module.exports = (app) => {
    const params = {
        secretOrKey: secret, //segredo deve estar no .env
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };

    const strategy = new Strategy(params, (payload, done) => {
        app.services.user.findOne({ id: payload.id })
            .then((user) => {
                if (user) done(null, { ...payload });
                else done(null, false);
            })
            .catch(err => done(err, false));
    });
    passport.use(strategy);

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', { session: false })
    };
}