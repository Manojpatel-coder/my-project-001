if(process.env.NODE_ENV!='production'){
  require('dotenv').config();
}





const express= require('express');
const mongoose = require('mongoose');   
const path=require('path');
const app= express();
app.use(express.json());
const flash=require('connect-flash')
const ejsMate=require('ejs-mate');
const methodOverrider=require('method-override');
app.use(methodOverrider('_method'));
const session=require('express-session');
const MongoStore=require('connect-mongo');
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
const Listing=require('./model/listing.js');
const Review=require('./model/review.js');
const listings=require('./routes/listing.js');
app.engine('ejs',ejsMate); // to use ejs-mate as the template engine
const reviews=require('./routes/review.js');
const userRouter=require('./routes/user.js')
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./model/user.js');

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const db_url=process.env.ATLASDB_URL
const store=MongoStore.create({
  mongoUrl:db_url,
  crypto:{
    secret:'mysupersecretcode'
  },
  touchAfter:24*3600,
})
store.on('error',(err)=>{
  console.log('error in mongo session store',err)
})
const sessionOptions={
  store,
  secret:"mysecretstring",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },

}




app.use(session(sessionOptions));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currUser=req.user;
  next();
})


app.get('/demouser',async (req,res)=>{
  let fakeUser=new User(
    {
      email:'studentgmail.com',
      username:'delta-student',
    }
  );
  let registerUser=await User.register(fakeUser,'helloworld');
  res.send(registerUser);
})

app.use('/listings',listings);
app.use('/listings/:id/reviews',reviews); 
app.use('/',userRouter);

// to use the same router for reviews as well
async function main(){
    await mongoose.connect(db_url);
    //till the documnet is not created, it(wanderlust) will not be created in the database
}
main().then(()=>console.log("Connected to MongoDB")).catch((err)=>console.log(err));

app.listen(8080,()=>{
  console.log("Server is running on port 8080");
}); 




 


