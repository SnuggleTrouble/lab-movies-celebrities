// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const express = require("express");
const router = express.Router();
const Celebrity = require("../models/Celebrity.model");
const Movie = require("../models/Movie.model");

// The GET route
router.get("/create", (req, res, next) => {
  res.render("movies/new-movie");
});

// The POST route
router.post("/create", (req, res, next) => {
  Movie.create(req.body)
    .then((movie) => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log(
        `There was an error when adding a movie ${error}. Please Try again`
      );
      res.render("movies/new-movie");
      next(error);
    });
});

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

// The Details route
router.get("/movies/:id", (req, res, next) => {
  Movie.findById(req.params.id)
    .populate("cast")
    .then((movie) => {
      res.render("movies/movie-details", { movie });
    })
    .catch((error) => {
      console.log(`There was an error when retrieving the movie id ${error}`);
    });
});

// The Delete route
router.post("/movies/:id/delete", (req, res, next) => {
  Movie.findByIdAndRemove(req.params.id)
    .then((movie) => {
      res.redirect("/movies");
    })
    .catch((error) => {
      console.log(`An error occurred when removing the movie ${error}`);
    });
});

// The Edit GET route
router.get("/movies/:id/edit", (req, res, next) => {
  Movie.findById(req.params.id).then((movie) => {
    Celebrity.find()
      .then((celebrities) => {
        res.render("movies/edit-movie", { celebrities });
      })
      .catch((error) => {
        console.log(`An error occurred when editing the movie ${error}`);
      });
  });
});

// The Edit POST route
router.post("/movies/:id/edit", (req, res, next) => {
  Movie.findByIdAndUpdate(req.params.id, req.body)
    .populate("cast")
    .then((movie) => {
      res.redirect("/movies");
    })
    .catch((error) => {
      console.log(`An error occurred when editing the movie ${error}`);
      res.render("movies/edit-movie");
    });
});

module.exports = router;
