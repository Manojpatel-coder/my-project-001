const express= require('express');
const router = express.Router({ mergeParams: true });
const multer=require('multer');
// const upload=multer({dest:'uploads/'})
const wrapAsync=require('../utils/wrapAsync.js');
const expressError=require('../utils/ExpressError.js');
const {listingSchema,reviewSchema}=require('../schema.js');
const {storage}=require('../cloudConfig.js');
const upload=multer({storage});
const Listing=require('../model/listing.js');
const Review=require('../model/review.js');
const { isLoggedIn,isOwner } = require('../middleware/isLoggedIn.js');
const listingController=require('../controller/listing.js')
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

  router.route('/')
  .get( listingController.index)
  .post(isLoggedIn, upload.single('listing[image]'),wrapAsync(listingController.createListing));

  router.get('/new',isLoggedIn,listingController.renderNewForm);
  
router.route('/:id')
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),listingController.updateListing)
.delete(isLoggedIn,isOwner,listingController.deleteListing);           






    


            
            

     
            
              
                  router.get('/:id/edit',isLoggedIn,isOwner,listingController.renderEditForm);

            


            module.exports=router;
