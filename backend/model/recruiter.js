import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:true,
        minLength:2
    },
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job'
    },
    otp:String,
    otpExpiry:Date,
});

const Recruiter = mongoose.model('Recruiter',recruiterSchema);
export default Recruiter;