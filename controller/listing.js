const Listing=require('../model/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});

module.exports.index=async (req, res) => {
    const allListings= await Listing.find({});
    res.render('listings/index.ejs',{allListings})
      }

      module.exports.renderNewForm=(req,res)=>{ 
      
        res.render('listings/new.ejs')
    }
      
    module.exports.showListings=async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate({
          path:'reviews',
          populate:{ //to populate nested means reviews and whole author details and lisitng have whole reviews details
          path:'author',
        }}).populate('owner');  // ✅ Await added

        if(!listing){
          req.flash("error","Listing does not exist");
          res.redirect('/listings');
        }
        res.render('listings/show.ejs', { listing });
    }

    module.exports.createListing=async (req, res) => {
        // Step 1: Ensure `listing` exists and is an object
let response=await geocodingClient
.forwardGeocode({
query:req.body.listing.location,
limit:1,
}).send();



       let url=req.file.path;
       let filename=req.file.filename;
    

        // Step 4: Use validated data
        const listingData = req.body.listing;
        const newListing = new Listing(listingData);
        newListing.owner=req.user._id;
        newListing.image={url,filename};
        newListing.geometry=response.body.features[0].geometry;
                console.log(newListing);
        await newListing.save();
        req.flash('success','new listing created');
        res.redirect('/listings');
      }


      module.exports.renderEditForm=async (req,res)=>{
                            const {id}=req.params;
                            const listing=await Listing.findById(id);
                            let blur_image_url=listing.image.url;
                            blur_image_url.replace('/upload','/upload/w_250');
                            res.render('listings/edit.ejs',{listing,blur_image_url});
                        } 

                        module.exports.updateListing=async (req, res) => {
                            const { id } = req.params;
                            const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
                          if(typeof req.file!="undefined"){
                            let url=req.file.path;
                            let filename=req.file.filename;
                            listing.image={url,filename};
                            console.log(listing);
                            await listing.save();
                          }
                          
                            req.flash("success", "Listing updated successfully");
                            res.redirect(`/listings/${id}`);
                          };


                                      module.exports.deleteListing=async (req,res)=>{
                                                      const {id}=req.params;
                                                      await Listing.findByIdAndDelete(id);
                                                      req.flash('success',"listing deleted")
                                                      res.redirect('/listings');
                                                  }
