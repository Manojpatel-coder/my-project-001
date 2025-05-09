const express=require('express');
const router=express.Router({mergeParams:true});
const User=require('../model/user.js');
const wrapAsync=require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware/isLoggedIn.js');
const userController=require('../controller/user.js');
router.route('/signup')
.get ((req,res)=>{ res.render('users/signup.ejs')})
.post(wrapAsync(userController.signup))




    router.route('/login')
    .get(userController.loginForm)
    .post(saveRedirectUrl
        ,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true,
        }),userController.login );



router.get('/logOut',userController.logOut)


module.exports=router;