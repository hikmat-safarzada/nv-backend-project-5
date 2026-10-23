const User = require("../models/User")
const {config} = require("../config/config")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const isProduction = config.node_env == "production"
const register = async (req, res) => {
    try {
        const {username, email, password} = req.body
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({
                message: "User already exists with the email"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "user"
        });
        res.status(201).json({
            message: "New User created successfully",
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message: "User Not Found"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            config.jwt_secret,
            {expiresIn: "14d"}
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction, 
            sameSite: isProduction ? "none" : "lax",
            maxAge: 14 * 24 * 60 * 60 * 1000,
            path: "/"
        })

        res.status(200).json({
            message: "Logged in successfully",
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            path: "/",
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        })
        res.status(201).json({
            message: "Logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


module.exports = {register, login, logout}