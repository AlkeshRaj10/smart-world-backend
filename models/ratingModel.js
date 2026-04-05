const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    givenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    review: {
        type: String,
        required: false,
        default: null
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessDetail",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    }
}, {
    timestamps: true
})

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;