const { Router } = require("express");
const router = new Router();
const bcrypt = require("bcrypt");
const saltRounds = 12;
const User = require("../models/User.model");
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
    /* console.log("The form data: ", req.body) */ const {
      username,
      email,
      password,
    } = req.body;
    if (!username || !email || !password) {
      res.render("auth/signup", {
        errorMessage:
          "All fields are mandatory. Please provide your username, email and password.",
      });
      return;
    }
    // make sure passwords are strong:
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          username,
          email,
          passwordHash: hashedPassword,
        });
      })
      .then((userFromDB) => {
        /* console.log("Newly created user is: ", userFromDB); */
        res.redirect("/userProfile");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render("auth/signup", { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render("auth/signup", {
            errorMessage:
              "Username and email need to be unique. Either username or email is already used.",
          });
        } else {
          next(error);
        }
      });
  });

  // The Login route
router.get("/login", isLoggedOut, (req, res) => {
    res.render("auth/login");
  });
  
  router.post("/login", (req, res, next) => {
    /* console.log("SESSION =====> ", req.session); */
    const { email, password } = req.body;
    if (email === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Please enter both, email and password to login.",
      });
      return;
    }
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          res.render("auth/login", {
            errorMessage: "Email is not registered. Try with a different email.",
          });
          return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
          // Save the user in the session
          req.session.currentUser = user;
          res.redirect("/userProfile");
        } else {
          res.render("auth/login", { errorMessage: "Incorrect password." });
        }
      })
      .catch((error) => next(error));
  });
  
  // The Logout route
  router.post("/logout", (req, res, next) => {
    req.session.destroy((error) => {
      if (error) next(error);
      res.redirect("/");
    });
  });
  
  // The user profile
  router.get("/userProfile", isLoggedIn, (req, res) => {
    res.render("users/user-profile", { userInSession: req.session.currentUser });
  });
  
  module.exports = router;