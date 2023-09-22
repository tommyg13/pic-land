"use strict";
const LocalStrategy = require("passport-local").Strategy,
  TwitterStrategy = require("passport-twitter").Strategy,
  configAuth = require("./auth"),
  User = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwtSecret = "your-secret-key";

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        process.nextTick(() => {
          req.checkBody("email", "Email is required").notEmpty();
          req.checkBody("email", "Email is not valid").isEmail();
          req.checkBody("username", "Username is required").notEmpty();
          req
            .checkBody("password", "Password must be at least 6 characters")
            .isLength({ min: 6 });
          req
            .checkBody("password2", "Passwords do not match")
            .equals(req.body.password);

          // handle the errors
          var errors = req.validationErrors();
          var error1 = [];
          if (errors) {
            errors.forEach((errs) => {
              error1.push(errs.msg);
            });
          }
          User.findOne({ "local.email": email }, (err, existingUser) => {
            if (err) return done(err);
            if (existingUser)
              return done(
                null,
                false,
                req.flash("error", "That email is already taken.")
              );
            if (errors)
              return done(null, false, req.flash("error_msg", error1));
            else {
              let newUser = new User();

              newUser.local.email = email;
              newUser.local.password = newUser.generateHash(password);
              newUser.local.username = req.body.username;
              newUser.local.image =
                "https://res.cloudinary.com/dlvavuuqe/image/upload/v1493481596/user2_ibfr6d.png";
              newUser.local.notifications = [];
              newUser.save((err) => {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        User.findOne({ "local.email": email }, (err, user) => {
          if (err) return done(err);

          if (!user)
            return done(null, false, req.flash("error", "No user found."));

          if (!user.validPassword(password))
            return done(
              null,
              false,
              req.flash("error", "Oops! Wrong email or password.")
            );
          else return done(null, user);
        });
      }
    )
  );
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecret,
      },
      (jwtPayload, done) => {
        User.findById(jwtPayload.sub, (err, user) => {
          if (err) return done(err, false);
          if (user) return done(null, user);
          return done(null, false);
        });
      }
    )
  );

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL,
        passReqToCallback: true,
      },
      (req, token, tokenSecret, profile, done) => {
        process.nextTick(() => {
          if (!req.user) {
            User.findOne({ "twitter.id": profile.id }, (err, user) => {
              if (err) return done(err);

              if (user) {
                if (!user.twitter.token) {
                  user.twitter.token = token;
                  user.twitter.username = profile.username;
                  user.twitter.displayName = profile.displayName;
                  user.twitter.image = profile.photos[0].value;
                  user.save((err) => {
                    if (err) throw err;
                    return done(null, user);
                  });
                }
                return done(null, user);
              } else {
                let newUser = new User();

                newUser.twitter.id = profile.id;
                newUser.twitter.token = token;
                newUser.twitter.username = profile.username;
                newUser.twitter.displayName = profile.displayName;
                newUser.twitter.image = profile.photos[0].value;
                newUser.save((err) => {
                  if (err) throw err;
                  return done(null, newUser);
                });
              }
            });
          }
        });
      }
    )
  );
};
