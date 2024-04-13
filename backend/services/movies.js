const MoviesModel = require("../models/moviesModel");

class MoviesService {
  getAllMovies = async () => {
    const movie = await MoviesModel.find({});
    if (!movie) {
      response.status(400);
      throw new Error("Unable to fetch");
    }
    return movie;
  };

  addMovie = async (data) => {
    const movie = await MoviesModel.create({ ...data });
    if (!movie) {
      response.status(400);
      throw new Error("Unable to save into DB");
    }
    return movie;
  };
}

module.exports = new MoviesService();
