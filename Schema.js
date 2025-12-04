const Joi=require('joi');
module.exports.listingschema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required().min(0),
        price:Joi.number().required(),
        image:Joi.string().allow("",null),
    }).required(),
})

module.exports.reviewschema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        Comment:Joi.string().required(),
    }).required(),
})