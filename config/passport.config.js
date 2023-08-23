const passport = require('passport');
const mongoose = require('mongoose');
const Player = require('../model/Player.model');
const Company = require('../model/Company.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser((user, next) => {
    next(null, user._id);
});

passport.deserializeUser((id, next) => {
    Player.findById(id)
        .then(player => {
            if (player) {
                next(null, player);
            } else {
                Company.findById(id)
                    .then(company => {
                        if (company) {
                            next(null, company);
                        }
                    })
                    .catch(err => next(err));
            }
        })
});


passport.use(
    'local-auth-player',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        (email, password, next) => {
                Player.findOne({ email })
                    .then(player => {
                        if (!player) {
                            next(null, null, { email: 'Email o contraseña inválidos.' });
                        } else {
                            return player.checkPassword(password)
                                .then(match => {
                                    if (!match) {
                                        next(null, null, { email: 'Email o contraseña inválidos.' });
                                    } else {
                                        next(null, player);
                                    }
                                });
                        }
                    })
                    .catch (err => next(err));}
)
);

passport.use(
    'local-auth-company',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        (email, password, next) => {
                Company.findOne({ email })
                    .then(company => {
                        if (!company) {
                            next(null, null, { email: 'Email o contraseña inválidos.' });
                        } else {
                            return company.checkPassword(password)
                                .then(match => {
                                    if (!match) {
                                        next(null, null, { email: 'Email o contraseña inválidos.' });
                                    } else {
                                        next(null, company);
                                    }
                                });
                        }
                    })
                    .catch (err => next(err));}
)
);

passport.use(
    'google-auth',
    new GoogleStrategy({
        clientID: process.env.G_CLIENT_ID,
        clientSecret: process.env.G_CLIENT_SECRET,
        callbackURL: process.env.G_REDIRECT_URI || '/authenticate/google/cb',
    },
        (accessToken, refreshToken, profile, next) => {
            const displayName = profile.displayName;
            const googleID = profile.id;
            const email = profile.emails[0] ? profile.emails[0].value : undefined;
            const avatar = profile.photos[0] ? profile.photos[0].value : undefined;

            if (displayName && googleID && email) {
                Player.findOne({ $or: [{ email }, { googleID }] })
                    .then(player => {
                        if (player) {
                            next(null, player);
                        } else {
                            const playerData = {
                                name: displayName,
                                email,
                                password: new mongoose.Types.ObjectId(),
                                googleID,
                                avatar: profile.photos[0].value
                            }
                            return Player.create(playerData)
                                .then(createdPlayer => next(null, createdPlayer))
                        }
                    })
                    .catch(err => next(err))
            } else {
                next(null, null, { email: 'Email o contaseña inválidos.' })
            }
        }
    )
);