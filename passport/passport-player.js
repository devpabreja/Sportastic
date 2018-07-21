const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const models = require("../models");

const localStrategy = new LocalStrategy((username, password, done) => {
	models.Player.findOne({
		username
	})
	      .then(player => {
		      if (player === null)
			      return done(null, false, { message: "User not found!" });
		      if (player.password !== password)
			      return done(null, false, { message: "Password Incorrect!!" });
		      return done(null, player);
	      })
	      .catch(err => {
		      console.log("ERROR");
		      done(err);
	      });
});

passport.use("local-player", localStrategy);


// Export passport
module.exports = passport;