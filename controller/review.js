const Listing = require("../model/listing");
const Review = require("../model/review");
const User=require('../model/user.js')


module.exports.createReview=async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).send('Listing not found');
    }

    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
req.flash('success','New Review Created');
    res.redirect(`/listings/${id}`);
}


module.exports.destroyReview=async (req, res) => {
                  const { id, reviewId } = req.params;
                  const listing = await Listing.findByIdAndUpdate(id, {
                    $pull: { reviews: reviewId } // Remove the review ID from the listing's reviews array
                  });
                  const review = await Review.findByIdAndDelete(reviewId);
                  res.redirect(`/listings/${id}`);
                }
