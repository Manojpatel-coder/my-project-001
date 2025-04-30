const express= require('express');
const mongoose = require('mongoose');   
const path=require('path');
const app= express();
const ejsMate=require('ejs-mate');
const methodOverrider=require('method-override');
const expressError = require('./utils/ExpressError');
app.use(methodOverrider('_method'));
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
const {listingSchema,reviewSchema}=require('./schema.js');
const Listing=require('./model/Listing.js');
const Review=require('./model/review.js');
app.engine('ejs',ejsMate); // to use ejs-mate as the template engine
app.listen(8080,()=>{
    console.log("Server is running on port 8080");
}); 
app.get('/',(req,res)=>{
    res.send("Hello World");
} );
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    //till the documnet is not created, it(wanderlust) will not be created in the database
}
main().then(()=>console.log("Connected to MongoDB")).catch((err)=>console.log(err));

// app.get('/testListing', async (req, res) => {
//     const samplelisting = new Listing({
//         title: "Test Listing",
//         description: "This is a test listing",
//         price: 100,
//         location: "Test Location",
//         country: "Test Country",
//     });

//    await samplelisting.save()
//         .then(() => {
//             res.send("Listing created successfully");
//         })
//         .catch((err) => {
//             res.send(err);
//         });
// });


app.get('/listings/new',(req,res)=>{ 
    res.render('listings/new.ejs')
}
    )

app.get('/listings',async (req, res) => {
  const allListings= await Listing.find({});
  res.render('listings/index.ejs',{allListings})
    }
    )
   
  function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
  }
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
  app.get('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');  // ✅ Await added
    res.render('listings/show.ejs', { listing });
}));
  app.post('/listings/:id/reviews',validateReview,wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
  
  }));
    app.post('/listings', wrapAsync(async (req, res) => {
       
       
      let result = listingSchema.validate(req.body);
      if(result.error) {
        throw new expressError(result.error.details[0].message, 400);
      }
      listingData = req.body.listing;
      if(listingData.image==null || listingData.image==""){
        listingData.image="https://source.unsplash.com/featured/?nature,water";   
      }
          const newListing = new Listing(listingData);
          await newListing.save();
          res.redirect('/listings');
          
        } 
      ));
      

    app.get('/listings/:id/edit',async (req,res)=>{
        const {id}=req.params;
        const listing=await Listing.findById(id);
        res.render('listings/edit.ejs',{listing});
    }   
);

app.put('/listings/:id',async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

app.delete('/listings/:id',async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}
);