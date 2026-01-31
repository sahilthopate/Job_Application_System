import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 10
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 10
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true
    },
    education: {
        degree: String,
        college: String,
        year: String
    },
    skills:{
        type:[String],
    },
    profilePhoto:{
        type:String,
    },
    location:{
        type:String,
    },
    otp: String,
    otpExpiry: Date,
});

const User = mongoose.model('User', userSchema);
export default User;