const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const usersSchema = new Schema({
    name: {
        type: String,
        default: 'Vito',
    },
    email: {
        type: String,
        required: [true, "db: Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "db: password is required"],
    },
    token: {
        type: String,
        default: null,
    },
    roles: [ 
        {
            type: String,
            ref: "Role",
        }
    ]
})

module.exports = mongoose.model('User', usersSchema);
