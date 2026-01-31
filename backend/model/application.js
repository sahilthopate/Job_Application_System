import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
    required: true
  },
  // resume: {
  //   type: String,
  //   required: true
  // },
  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Rejected"],
    default: "Applied"
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;