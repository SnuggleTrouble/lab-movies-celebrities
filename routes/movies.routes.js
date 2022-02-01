// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");
const Movie = require("../models/Movie.model");

// Route for listing all movies
router.get("/", (req, res, next) => {
  Movie.find()
    .then((movies) => {
      res.render("movies/movies", { movies });
    })
    .catch((error) => {
      console.log(`There was an error when listing movies. ${error}`);
    });
});

// The GET route
router.get("/create", (req, res, next) => {
  res.render("movies/new-movie");
});

// The POST route
router.post("/create", (req, res, next) => {
  Movie.create(req.body)
    .then((movie) => {
      res.redirect("/movies");
    })
    .catch((error) => {
      console.log(
        `There was an error when adding a movie ${error}. Please Try again`
      );
      res.render("movies/new-movie");
      next(error);
    });
});

module.exports = router;
