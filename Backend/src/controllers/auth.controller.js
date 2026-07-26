const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blackList.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
/**
 * @route POST /api/auth/register
 * @description Register a new user expecting a JSON body with username, email, and password
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;
    if(!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
    }
    const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }]
});

if (isUserAlreadyExists) {
    if (isUserAlreadyExists.username === username) {
        return res.status(400).json({ message: "Username is already taken" });
    }

    if (isUserAlreadyExists.email === email) {
        return res.status(400).json({ message: "Email is already taken" });
    }
}
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        username,
        email,
        password: hash
    })
    const token = jwt.sign(
        // Payload
    {
        id: user._id,
        username: user.username,
    },
        // Secret
    process.env.JWT_SECRET,
        // Options
    { expiresIn: "2d" });  
    
    res.cookie("token", token);

     res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @route POST /api/auth/login
 * @description Login a user expecting a JSON body with email and password
 * @access Public
 */
async function LoginUserController(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({
        email
    })
    if(!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(400).json({ 
            message: "Invalid Password" 
        });
    }
    const token = jwt.sign(
        // Payload
    {
        id: user._id,
        username: user.username,
    },
        // Secret
    process.env.JWT_SECRET,
        // Options
    { expiresIn: "2d" });  
    
    res.cookie("token", token);

     res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
/**
 * @route POST /api/auth/logout
 * @description Clear token from cookies and add it to blacklist
 * @access Public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token;
    if (token) {
        await tokenBlacklistModel.create({ token });
    }
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" })
}

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)
    return res.status(200).json({
        message: "User details fetched successfully",
        user:{
        id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


module.exports = {
    registerUserController,
    LoginUserController,
    logoutUserController,
    getMeController
}