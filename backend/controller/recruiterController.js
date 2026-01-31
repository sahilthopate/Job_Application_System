import SendmailTransport from "../utils/sendmail.js";
import Recruiter from "../model/recruiter.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Application from "../model/application.js";
import Job from "../model/jobs.js";

//recruiterSignup
const recruiterSignup = async (req, res) => {
    try {
        const { companyName, email, password } = req.body;

        if (!companyName || !email || !password) {
            return res.status(400).json(
                {
                    message: 'All feilds are required'
                }
            )
        }

        const exists = await Recruiter.findOne({ email: email.toLowerCase() });

        if (exists) {
            return res.status(401).json(
                {
                    message: 'Recruiter Email already Exist '
                }
            );
        }

        const hassPassLength = 10;
        const hassPass = await bcrypt.hash(password, hassPassLength);

        const newRecruiter = await Recruiter.create({
            companyName,
            email: email.toLowerCase(),
            password: hassPass
        });

        res.status(201).json(
            {
                message: 'Recruiter created successfully',
                recruiter: {
                    id: newRecruiter._id,
                    companyName: newRecruiter.companyName,
                    email: newRecruiter.email,
                }
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json(
            {
                message: 'server error || Recruiter Created Failed'
            }
        );
    }
}

//recruiterLogin
const recruiterLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json(
                {
                    message: 'All feilds are required'
                }
            )
        }

        const recruiter = await Recruiter.findOne({ email });

        if (!recruiter) {
            return res.status(404).json(
                {
                    message: 'Recruiter Email Not found'
                }
            )
        }

        const matchPass = await bcrypt.compare(password, recruiter.password);


        if (!matchPass) {
            return res.status(404).json(
                {
                    message: 'Invalid Password'
                }
            )
        }

        const token = jwt.sign(
            {
                id: recruiter._id,
                role: 'recruiter'
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );


        res.status(200).json({
            token,
            role: 'recruiter',
            message: "Login successful",
            recruiterId:recruiter._id,
            recruiter,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json(
            {
                message: 'server error'
            }
        )
    }
}

//recruiterForgotPassword
const recruiterForgotPass = async (req, res) => {
    try {
        const { email } = req.body;

        const recruiter = await Recruiter.findOne({ email });
        if (!recruiter) {
            return res.status(400).json(
                {
                    message: 'Email Not Found'
                }
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        recruiter.otp = otp;
        recruiter.otpExpiry = Date.now() + 5 * 60 * 1000;
        await recruiter.save();

        await SendmailTransport(email, otp);

        return res.status(200).json(
            {
                message: 'OTP send to Your Mail',
            }
        )
    } catch (error) {
        console.log(error);
        res.status(500).json(
            {
                message: 'server error'
            }
        )
    }
}

//Recruiter recruiterVerifyOTP
const recruiterVerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json(
                {
                    message: 'All fields are required'
                }
            )
        }

        const recruiter = await Recruiter.findOne({ email: email.toLowerCase() });

        if (!recruiter) {
            res.status(400).json(
                {
                    message: 'user not found'
                }
            );
        }

        if (!recruiter.otp || !recruiter.otpExpiry) {
            return res.status(400).json(
                {
                    message: "OTP not generated or expired"
                }
            );
        }

        if (String(recruiter.otp) !== String(otp)) {
            return res.status(400).json(
                {
                    message: "Invalid OTP"
                }
            );
        }

        if (Date.now() > recruiter.otpExpiry) {
            return res.status(400).json(
                {
                    message: "OTP expired"
                }
            );
        }

        recruiter.otp = null;
        recruiter.otpExpiry = null;
        await recruiter.save();

        res.status(200).json(
            {
                message: 'OTP verify successfully'
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                message: 'server error'
            }
        );
    }
}

//Recruiter updatePassword
const recruiterUpdatePassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json(
                {
                    message: 'All fields are required'
                }
            );
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json(
                {
                    message: 'Password does not match'
                }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        const updatedRecruiter = await Recruiter.findOneAndUpdate(
            { email: email.toLowerCase() },
            {
                $set: {
                    password: hashedPassword,
                    otp: null,
                    otpExpiry: null
                }
            }
        );

        if (!updatedRecruiter) {
            return res.status(400).json(
                {
                    message: 'User Not Found'
                }
            );
        }

        return res.status(200).json(
            {
                message: 'Password Reset Successfully'
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json(
            {
                message: 'server error'
            }
        );
    }

}

//Get Applicantdata
const recruiterGetApplicantData = async (req, res) => {
    try {
        const recruiterId = req.user.id;

        const applications = await Application.find({ recruiterId })
            .populate("userId")
            .populate("jobId")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            applications
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};


//Sent Result
const recruiterSentResult = async (req, res) => {
    try {
        const recruiterId = req.user.id;
        const applicationId = req.params.applicationId;
        const { status } = req.body;

        const allowStatus = ['Applied', 'Shortlisted', 'Rejected'];
        if (!allowStatus.includes(status)) {
            return res.status(400).json(
                {
                    message: 'Invalid status value'
                }
            );
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(400).json(
                {
                    message: 'Application Not Found'
                }
            );
        }

        if (application.recruiterId.toString() !== recruiterId) {
            return res.status(403).json({
                message: "You are not allowed to update this application"
            });
        }

        application.status = status;
        await application.save();

        res.status(200).json({
            message: "Application status updated",
            application
        });
        console.log(application);

    } catch (error) {
        console.log(error);

        return res.status(500).json(
            {
                message: 'Server error'
            }
        );
    }
}

//Get Posted jobs
const recruiterPostedJobs = async (req, res) => {
    try {
        const recruiterId = req.user.id;

        const jobs = await Job.find({ recruiterId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: jobs.length ? "All Jobs Posted by Recruiter" : "No jobs found",
            jobs: jobs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};



//delete Specific job
const recruiterDeleteJob = async (req, res) => {
    try {
        const recruiterId = req.user.id;
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {
            res.status(404).json(
                {
                    message: 'Job not found'
                }
            );
        }

        if (job.recruiterId.toString() !== recruiterId) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: "Job deleted successfully",
        });
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error"
            }
        );
    }
}


//Update Specific Job
const recruiterEditJob = async (req, res) => {
    try {
        const recruiterId = req.user.id;
        const { jobId } = req.params;

        const {
            jobTitle,
            jobDescription,
            skills,
            location,
            salary,
        } = req.body;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // ✅ Security check
        if (job.recruiterId.toString() !== recruiterId) {
            return res.status(403).json({
                message: "Unauthorized action"
            });
        }

        // ✅ Update job
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            {
                jobTitle,
                jobDescription,
                skills,
                location,
                salary,
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};



export default
    {
        recruiterSignup,
        recruiterLogin,
        recruiterForgotPass,
        recruiterVerifyOTP,
        recruiterUpdatePassword,
        recruiterGetApplicantData,
        recruiterSentResult,
        recruiterPostedJobs,
        recruiterDeleteJob,
        recruiterEditJob
    };