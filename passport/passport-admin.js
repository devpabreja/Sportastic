const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const models = require("../models");

passport.serializeUser((user, done) =>  {
    console.log("Deserialize Admin");
    console.log(user);
    done(null, user.username);
});

passport.deserializeUser((req, username, done) => {
    models.Admin.findOne({
        username
    })
        .then(admin => {
            if (admin)
                return done(null, admin);
            models.Player.findOne({
                username
            })
                .then(user => done(null, user))
        })
        .catch(err => done(err));
});


const localStrategy = new LocalStrategy((username, password, done) => {
    models.Admin.findOne({
        username
    })
        .then(admin => {
            if (admin === null)
                return done(null, false, { message: "User not found!" });
            if (admin.password !== password)
                return done(null, false, { message: "Password Incorrect!!" });
            return done(null, admin);
        })
        .catch(err => {
            console.log("ERROR");
            done(err);
        });
});

passport.use("local-admin", localStrategy);


// Export passport
module.exports = passport;