const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// the celebrities route
const celebrities = require("./celebrities.routes");
router.use("/celebrities", celebrities);

//the movies route
const movies = require("./movies.routes");
router.use("/movies", movies);

module.exports = router;
