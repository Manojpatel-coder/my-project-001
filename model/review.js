const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    content: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Fix: check if the model is already compiled
module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
