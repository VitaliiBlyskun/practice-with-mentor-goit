const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const roleSchema = new Schema({
    value: {
        type: String,
        unique: true,
        default: 'USER',
    }
})

module.exports = mongoose.model('Role', roleSchema);