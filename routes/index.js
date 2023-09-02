"use strict";
const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  bcrypt = require("bcryptjs"),
  nodemailer = require("nodemailer"),
  sgTransport = require("nodemailer-sendgrid-transport"),
  async = require("async"),
  crypto = require("crypto"),
  Image = require("../models/image"),
  User = require("../models/user");

require("dotenv").config();
const pass = process.env.PASS;

router.get("/", (req, res) => {
  Image.find().then((match) => {
    if (req.user === undefined) {
      res.render("index", { title: "Home", images: match });
    } else {
      match.map((doc) => {
        doc.likedBy.map((liked) => {
          if (liked.toString() === req.user._id.toString()) {
            doc.likeClass = true;
            doc.save();
          } else {
            doc.likeClass = false;
            doc.save();
          }
        });
      });
      res.render("index", { title: "Home", images: match });
    }
  });
});

router.get("/auth", (req, res) => {
  if (req.user) {
    req.flash("success_msg", "You are already logged in");
    res.redirect("back");
  } else {
    res.render("auth", { title: "auth", csrfToken: req.csrfToken() });
  }
});

router.post(
  "/register",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/auth",
    failureFlash: true,
  })
);

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/auth",
    failureFlash: true,
  })
);

router.get(
  "/auth/twitter",
  passport.authenticate("twitter", { scope: "email" })
);

router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "/",
    failureRedirect: "/auth",
  })
);

router.post("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out ");
  res.redirect("auth");
});

/* Render forgot password page */
router.get("/forgot", (req, res) => {
  res.render("forgot", {
    title: "Forgot password",
    csrfToken: req.csrfToken(),
  });
});

/* Handle forgot password */
router.post("/forgot", (req, res, next) => {
  async.waterfall(
    [
      function (done) {
        // create token for the email
        crypto.randomBytes(20, function (err, buf) {
          let token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ "local.email": req.body.email }, function (err, user) {
          // redirect to the forgot page if no user found
          if (!user) {
            req.flash("error", "No account with that email address exists.");
            return res.redirect("/forgot");
          }

          // save token with expiration date
          user.local.resetPasswordToken = token;
          user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        // email options
        var options = {
          auth: {
            api_user: "tommyg13",
            api_key: pass,
          },
        };
        let mailer = nodemailer.createTransport(sgTransport(options));

        // create the email for reseting password
        let email = {
          to: user.local.email,
          from: "thomasgk13@gmail.com",
          subject: "Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "https://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        mailer.sendMail(email, function (err) {
          req.flash(
            "success_msg",
            "An e-mail has been sent to " +
              user.local.email +
              " with further instructions.Check also in spam folder"
          );
          done(err, "done");
        });
      },
    ],
    function (err) {
      // handle the errors
      if (err) return next(err);
      res.redirect("/forgot");
    }
  );
});

/* render reset page*/
router.get("/reset/:token", function (req, res) {
  User.findOne(
    {
      "local.resetPasswordToken": req.params.token,
      "local.resetPasswordExpires": { $gt: Date.now() },
    },
    function (err, user) {
      // render message if token is invalid or has expired
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot");
      }

      // if token is correct proceed to reset page
      res.render("reset", {
        title: "Password Reset",
        csrfToken: req.csrfToken(),
      });
    }
  );
});

/* handle reset */
router.post("/reset/:token", function (req, res) {
  async.waterfall(
    [
      function (done) {
        User.findOne(
          {
            "local.resetPasswordToken": req.params.token,
            "local.resetPasswordExpires": { $gt: Date.now() },
          },
          function (err, user) {
            // render message if token is invalid or has expired
            if (!user) {
              req.flash(
                "error",
                "Password reset token is invalid or has expired."
              );
              return res.redirect("back");
            }

            // throw error if emails not match
            if (user.local.email !== req.body.email) {
              req.flash("error", "Email is wrong");
              return res.redirect("back");
            }
            // check if the passwords are equal
            if (req.body.password !== req.body.confirm) {
              req.flash("error", "Passwords do not match");
              return res.redirect("back");
            }
            // check passwords length
            if (req.body.password.length < 6) {
              req.flash("error", "Password must be at least 6 characters");
              return res.redirect("back");
            }

            // has the password
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(req.body.password, salt);
            req.body.password = hash;
            user.local.password = req.body.password;
            user.local.resetPasswordToken = undefined;
            user.local.resetPasswordExpires = undefined;
            user.save(function (err) {
              done(err, user);
            });
          }
        );
      },
      function (user, done) {
        // username and password for the email
        var options = {
          auth: {
            api_user: "tommyg13",
            api_key: pass,
          },
        };
        // send confirmation email
        let email = {
          to: user.local.email,
          from: "thomasgk13@gmail.com",
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.local.email +
            " has just been changed.\n",
        };
        let mailer = nodemailer.createTransport(sgTransport(options));

        mailer.sendMail(email, function (err) {
          if (err) console.log(err);
          req.flash("success_msg", "Success! Your password has been changed.");
          res.redirect("/");
        });
      },
    ],
    function (err) {
      res.redirect("/");
    }
  );
});

router.get("/settings", isLoggedIn, (req, res) => {
  if (req.user === undefined || req.user.twitter.username !== undefined) {
    res.redirect("/");
  } else {
    let query = { "local.email": req.user.local.email };

    User.findOne(query).then((user) => {});
    res.render("settings", { csrfToken: req.csrfToken() });
  }
});

/**
 *  Update user Password
 */
router.post("/password-change", isLoggedIn, function (req, res) {
  let query = { "local.username": req.user.local.username };

  // hash the password
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(req.body.New_password, salt);
  req.body.New_password = hash;

  User.findOne(query).then((doc) => {
    // check password length
    if (req.body.New_password.length < 6 || req.body.New_password1.length < 6) {
      req.flash("error", "Password must be at least 6 characters");
    }

    // check if the old password is correct
    if (!bcrypt.compareSync(req.body.Old_password, doc.local.password)) {
      req.flash("error", "Your old password is incorrect");
    }

    // check if new password and password confirm are equal
    if (!bcrypt.compareSync(req.body.New_password1, req.body.New_password)) {
      req.flash("error", "Passwords do not match");
    }

    // if not errors update password
    else {
      doc.local.password = req.body.New_password;
      doc.save();
      req.flash("success_msg", "Your password has been successfully changed");
    }
    res.redirect("/settings");
    async.waterfall([
      function (done) {
        // create token
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne(
          { "local.email": req.user.local.email },
          function (err, user) {
            if (err) {
              console.log(err);
            }
            user.local.resetPasswordToken = token;
            user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
            });
          }
        );
      },
      function (token, user, done) {
        var options = {
          auth: {
            api_user: "tommyg13",
            api_key: pass,
          },
        };
        var mailer = nodemailer.createTransport(sgTransport(options));
        var email = {
          to: user.local.email,
          from: "thomasgk13@gmail.com",
          subject: "Password Change",
          text:
            "You are receiving this because you (or someone else) have changed the password for your account.\n\n" +
            "If you did not request this, please click on the following link, or paste this into your browser to reset the password:\n\n" +
            "https://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you made the made the change, please ignore this email and your new password will remain unchanged.\n",
        };
        mailer.sendMail(email, function (err) {
          req.flash(
            "success_msg",
            "An e-mail has been sent to " +
              user.local.email +
              " with further instructions."
          );
          done(err, "done");
        });
      },
    ]);
  });
});

router.post("/account_delete", isLoggedIn, (req, res) => {
  User.findOne({ "local.email": req.user.local.email }).then((user) => {
    let id = user._id;
    let imagId;
    Image.find({ user: id }).then((images) => {
      images.map((image) => {
        imagId = image._id;
        Image.findByIdAndRemove(imagId).exec();
      });
    });
    User.findByIdAndRemove(id).exec();
  });
  req.flash("success_msg", "Your account has been successfully deleted");
  res.redirect("/auth");
});

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "Please sign in or register to view this page.");
  res.redirect("/auth");
}

module.exports = router;
