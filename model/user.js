const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');
const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
})

//password and username hashed and salting automaticalyy done by passowrdlocalmonggose
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',userSchema);