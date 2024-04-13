const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const moviesSchema = new Schema({
    title: {
        required: [true, "db: title is required"],
        type: String,
    },
    director: {
        type: String,
        default: 'Quentin Tarantino',
    },
    year: {
        type: Number,
        default: 1990,
    },
    rating: {
        required: [true, "db: rating is required"],
        type: Number,
    }
})


module.exports = mongoose.model('Movie', moviesSchema);


