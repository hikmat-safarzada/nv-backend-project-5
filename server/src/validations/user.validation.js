const Joi = require("joi")
const userValidation = Joi.object({
    username: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 2 characters",
            "string.max": "Name cannot exceed 50 characters",
            "any.required": "Name is required"
        }),

    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email",
            "any.required": "Email is required"
        }),

    password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password cannot exceed 128 characters",
            "any.required": "Password is required"
        }),

    role: Joi.string()
        .valid("user", "admin")
        .messages({
            "any.only": "Role must be either user or admin",
            "string.empty": "Role is required",
            "any.required": "Role is required"
        })
});


const loginValidation = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email",
            "any.required": "Email is required"
        }),

    password: Joi.string()
        .required()
        .messages({
            "string.empty": "Password is required",
            "any.required": "Password is required"
        })
});

module.exports = { userValidation, loginValidation }