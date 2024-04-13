const asyncHandler = require("express-async-handler");

const { Error } = require("mongoose");
// const MoviesModel = require("../models/moviesModel");

const MoviesService = require("../services/movies");

class moviesController {
  addMovie = asyncHandler(async (request, response) => {
    const { title, rating } = request.body;

    if (!title || !rating) {
      response.status(400);
      throw new Error("Provide all required fields");
    }

    const isAdded = await MoviesService.addMovie(request.body);

    if (isAdded) {
      response.status(201).json({
        code: 201,
        message: "Success",
        data: isAdded,
      });
    }
  });

  moviesList = asyncHandler(async (request, response) => {
    const movies = await MoviesService.getAllMovies();
    response.status(200).json({
      code: 200,
      message: "Success",
      data: movies,
      quantity: movies.length,
    });
  });

  async oneMovie(request, response) {}

  async updateOneMovie(request, response) {}

  async removeOneMovie(request, response) {}
}

module.exports = new moviesController();
