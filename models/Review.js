const mongoose = require('mongoose');
const {Schema} = mongoose;
const ReviewSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    msg: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('review', ReviewSchema);