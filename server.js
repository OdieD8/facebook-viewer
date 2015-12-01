var express = require("express");
var session = require("express-session");
var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var keys = require("./keys");

var app = express();
app.use(session({ secret: "lkjadsf-09845-43" }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
	clientID: keys.facebookID,
	clientSecret: keys.facebookSecret,
	callbackURL: "http://localhost:8500/auth/facebook/callback"
}, function (token, refreshToken, profile, done) {
	return done(null, profile);
}
	));

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get("/auth/facebook/callback", passport.authenticate("facebook", {
	successRedirect: "/me",
	failureRedirect: "/login"
}), function (req, res) {
	console.log(req.session);
});

passport.serializeUser(function (user, done) {
	//function that is called by passport before data is pulled from the session
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	//function that is called by passport after data is pulled from the session
	done(null, obj);
});

var requireAuth = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	return res.redirect("/auth/facebook")
}

app.get("/me", requireAuth, function (req, res) {
	var currentLoggedInUserOnSession = req.user;
	res.send(currentLoggedInUserOnSession);
});

var port = 8500;
app.listen(port, function () {
	console.log("listening on port:", port);
});