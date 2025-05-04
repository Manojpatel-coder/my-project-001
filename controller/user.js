
const User=require('../model/user.js');

module.exports.signup=async(req,res)=>{
 try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
     const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash('success','Welcome')
        res.redirect('/listings');
    })
   
 }
 catch(err){
    req.flash('error',err.message);
    res.redirect('/signup');
 }
    }

    module.exports.loginForm=(req,res)=>{
        res.render('users/login.ejs')
    }


    module.exports.login=(req, res) => {
        if (!req.user) return; // just in case
        req.flash('success', 'Welcome here');
        let redirectUrl=res.locals.redirectUrl || "/listings";
        return res.redirect(redirectUrl);
    }


    module.exports.logOut=(req,res,next)=>{
        req.logOut((err)=>{
            if(err){
                next(err);
            }
            req.flash('success',"You logged out successfully");
            res.redirect('/listings');
        })
    }