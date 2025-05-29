const mongoose = require('mongoose');
const {Schema} = mongoose;
const ChatSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    messages: [
        {
            query: {
                type: String,
                required: true
            },
            answer: {
                type: String,
                required: true
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Chat', ChatSchema);