import User from '../model/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import SendmailTransport from '../utils/sendmail.js';
import Job from '../model/jobs.js';
import Application from '../model/application.js';

//User Signup
const userSignUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        if (!firstName || !lastName || !email || !password || !phone) {
            return res.status(400).json(
                {
                    message: 'All Feilds Are required'
                }
            );
        }

        const exists = await User.findOne({ email: email.toLowerCase() });

        if (exists) {
            return res.status(409).json(
                {
                    message: 'User Email Already Exists'
                }
            )
        }

        const hassPassLength = 10;
        const hashPass = await bcrypt.hash(password, hassPassLength);

        const newUser = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashPass,
            phone
        });

        res.status(201).json(
            {
                message: 'User Created Successfully',
                user: {
                    id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    phone: newUser.phone
                }
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json(
            {
                message: 'Server error'
            }
        )
    }
}

//User Login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json(
                {
                    message: 'All feilds are required'
                }
            )
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(
                {
                    message: 'User Email Not found'
                }
            )
        }

        const matchPass = await bcrypt.compare(password, user.password);


        if (!matchPass) {
            return res.status(404).json(
                {
                    message: 'Invalid Password'
                }
            )
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: 'user'
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            token,
            role: 'user',
            message: "Login successful",
            userId:user._id,
            user,
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

//User ForgotPassword
const userForgotPass = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(
                {
                    message: 'Email Not Found'
                }
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

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

//User VerifyOTP
const userVerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json(
                {
                    message: 'All fields are required'
                }
            )
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            res.status(400).json(
                {
                    message: 'user not found'
                }
            );
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json(
                {
                    message: "OTP not generated or expired"
                }
            );
        }

        if (String(user.otp) !== String(otp)) {
            return res.status(400).json(
                {
                    message: "Invalid OTP"
                }
            );
        }

        if (Date.now() > user.otpExpiry) {
            return res.status(400).json(
                {
                    message: "OTP expired"
                }
            );
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

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

//User updatePassword
const userUpdatePassword = async (req, res) => {
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
        const updatedUser = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            {
                $set: {
                    password: hashedPassword,
                    otp: null,
                    otpExpiry: null
                }
            }
        );

        if (!updatedUser) {
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

//Get Job form posted Recruiter
const userGetJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('recruiterId').sort({ createdAt: -1 });
        res.status(200).json(
            {
                jobs,
                "appliedJobIds": ["jobId1", "jobId2"],
                message: 'All Jobs data'
            }
        )
    } catch (error) {
        console.log(error);

        res.status(500).json(
            {
                message: 'server error'
            }
        );
    }
}

//User AppyJob
const userApplyJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobId = req.params.jobId;

        const alreadyApplied = await Application.findOne({ userId, jobId });
        if (alreadyApplied) {
            return res.status(400).json({ message: "Already applied" });
        }

        const job = await Job.findById(jobId);

        await Application.create({
            userId,
            jobId,
            recruiterId: job.recruiterId,
        });

        res.status(200).json({ message: "Applied successfully" });
    } catch (error) {
        console.log(error);
        
        res.status(500).json(
            {
                message: 'server error'
            }
        );
    }
};

//User get Status
const userAppliedJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const applications = await Application.find({ userId })
            .populate(
                {
                    path: 'jobId',
                    select: 'jobTitle jobDescription salary location'
                }
            ).populate(
                {
                    path: 'recruiterId',
                    select: 'companyName email'
                }
            ).sort(
                {
                    appliedAt: -1
                }
            );

        return res.status(200).json(
            {
                applications
            }
        );
    } catch (error) {
        console.log(error);

        return res.status(500).json(
            {
                message: 'server error'
            }
        );
    }
}

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const {
            name,
            phoneNumber,
            location,
            education,
            skills,
            profilePhoto,
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.name = name || user.name;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.location = location || user.location;
        user.profilePhoto = profilePhoto || user.profilePhoto;
        user.education = education || user.education;
        user.skills = skills || user.skills;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

const userChangePassword = async (req, res) => {
    try {
        const {newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) {
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
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    password: hashedPassword,
                    otp: null,
                    otpExpiry: null
                }
            }
        );

        if (!updatedUser) {
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
export default
    {
        userSignUp,
        userLogin,
        userForgotPass,
        userVerifyOTP,
        userUpdatePassword,
        userGetJobs,
        userApplyJob,
        userAppliedJob,
        getUserProfile,
        updateUserProfile,
        userChangePassword
    };