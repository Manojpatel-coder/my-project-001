const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const expressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const Listing = require('../model/Listing.js');
const Review = require('../model/review.js');
const { isLoggedIn,isAuthor   } = require('../middleware/isLoggedIn.js');
const reviewController=require('../controller/review.js')
const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body); 
    if(error){
        const msg=error.details.map((el)=>el.message).join(',')
        throw new expressError(msg,400);
    }
    else{
        next();
    }
  }  


  router.post('/',isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

          router.delete('/:reviewId',isLoggedIn,isAuthor, wrapAsync(reviewController.destroyReview
                ));

                module.exports = router;