// http://localhost:5050/api/v1/movies
const express = require("express");

const moviesRouter = express.Router();

const moviesController = require("../controllers/MoviesController");
const auth = require('../middlewares/auth');
const roleMiddlware = require("../middlewares/roleMiddlware");

// додати один фільм

moviesRouter.post(
  "/movies",
  (request, response, next) => {
    console.log("Joi is working");
    next();
  },
  moviesController.addMovie
);

// отримати всі фільми
 
moviesRouter.get("/movies", roleMiddlware(["USER", "ADMIN", "MODERATOR"]), moviesController.moviesList);

// отримати один фільм

moviesRouter.get("/movies/:id", moviesController.oneMovie);

// обновити один фільм

moviesRouter.put("/movies/:id", moviesController.updateOneMovie);

// видалити один фільм

moviesRouter.delete("/movies/:id", moviesController.removeOneMovie);

module.exports = moviesRouter;
