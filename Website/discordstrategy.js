const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");
const fetch = require("node-fetch");

passport.use(
    new DiscordStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CLIENT_REDIRECT,
            scope: ["identify"]
        },
        async(accessToken, refreshToken, profile, done) => {
            process.nextTick(function() {
                return done(null, profile);
            });
        }
    )
);