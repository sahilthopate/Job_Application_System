import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 40
    },
    skills: {
        type: [String],
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true
    },
    createdAt: {
        type: Date
    }
});

const Job = mongoose.model("Job", jobSchema);
export default Job;