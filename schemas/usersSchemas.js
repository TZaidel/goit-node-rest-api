import Joi from "joi";

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;


export const userSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().required(),
})

