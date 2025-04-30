const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: Number,
  location: String,
  image: {
    filename: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1374&q=80"
    }
  },
  country: String,
  reviews: [
    {
      type:Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});


const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;