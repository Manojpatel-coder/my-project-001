const Joi=require('joi');
const Review=require('./model/review');
module.exports.listingSchema=Joi.object({
    listing:
    Joi.object({title:Joi.string().min(3).max(30).required(),
    description:Joi.string().min(3).max(1000).required(),
     price:Joi.number().min(0).required(),
    location:Joi.string().min(3).max(100).required(),
    country:Joi.string().min(3).max(100).required(),    
     image:Joi.string().allow("",null)}).required()


})


module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().min(3).max(1000).required()
    }).required()
});


