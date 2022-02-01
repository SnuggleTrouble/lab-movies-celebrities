const app = require("../app");

// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");

// Create celebrity
router.get("/celebrities/create", (req, res, next) => {
  res.render("/celebrities/new-celebrity");
});

router.post("/celebrities/create", (req, res, next) => {
  Celebrity.create(req.body)
    .then((newCelebrity) => {
      res.redirect("/celebrities/celebrities");
    })
    .catch((error) => {
      console.log(
        `There was an error when creating a new celebrity: ${error}. Please try again`
      );
      res.render("/celebrities/new-celebrity");
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
        console.log(`There was an error when loading the celebrities: ${error}`);
      });
  });

module.exports = router;
