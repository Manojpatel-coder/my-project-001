const mongoose = require('mongoose');
const initData=require('./data.js');
const Listing=require('../model/Listing.js');
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  };
main().then(()=>console.log("Connected to MongoDB")).catch((err)=>console.log(err));


const initDB =async()=>{ 
    await Listing.deleteMany({});  
    initData.data=initData.data.map((obj)=>({
      ...obj,owner:"681493526b58c4231e3908a7"
    }))
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data.");
}
initDB();