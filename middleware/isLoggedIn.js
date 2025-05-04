const Listing=require('../model/listing.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "Please login first");
        return res.redirect('/login'); // ✅ use return to prevent further execution
    }
    next(); // ✅ only called if user is logged in
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner=async (req,res,next)=>{
    const {id}=req.params;
    const listing= await Listing.findById(id);
    if(!res.locals.currUser._id.equals(listing.owner._id)){
      req.flash("error","You have not permission to edit");
     return  res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor=async (req,res,next)=>{
    const {id,reviewId}=req.params;
    const review= await Review.findById(reviewId);
    if(!res.locals.currUser._id.equals(review.author._id)){
      req.flash("error","You cannot  delete review created by someone else");
     return  res.redirect(`/listings/${id}`);
    }
    next();
}
