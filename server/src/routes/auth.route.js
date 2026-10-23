const express = require("express");
const {register, login, logout} = require("../controllers/auth.controller")
const validate = require("../middleware/validate")
const {userValidation, loginValidation} = require("../validations/user.validation");
const router = express.Router();

router.post("/register", validate(userValidation),  register);
router.post("/login", validate(loginValidation), login);
router.post("/logout", logout)

module.exports = router