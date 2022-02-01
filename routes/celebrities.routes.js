// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const express = require("express");
const router = express.Router();
const Celebrity = require("../models/Celebrity.model");

// The GET route
router.get("/create", (req, res, next) => {
  res.render("celebrities/new-celebrity");
});

// The POST route
router.post("/create", (req, res, next) => {
  Celebrity.create(req.body)
    .then((celebrity) => {
      res.redirect("/celebrities");
    })
    .catch((error) => {
      console.log(
        `There was an error when adding a new celebrity: ${error}. Please try again`
      );
      res.redirect("/celebrities/create");
      next(error);
    });
});

// Route to show all celebrities
router.get("/", (req, res, next) => {
  Celebrity.find()
    .then((celebrities) => {
      res.render("celebrities/celebrities", { celebrities });
    })
    .catch((error) => {
      console.log(`There was an error when listing celebrities: ${error}`);
    });
});

module.exports = router;
