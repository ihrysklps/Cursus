const mongoose = require("mongoose");
 const userSchema = new mongoose.Schema({
     username: {
         type: String,
         unique: [true,"username already taken"],
         required: [true,"username is required"]
     },
     email: {
            type: String,
            unique: [true,"email already taken"],
            required: [true,"email is required"]
     },
        password: {
            type: String,
            required: [true,"password is required"]
        }
})

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;