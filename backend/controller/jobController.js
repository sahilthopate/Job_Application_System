import Job from '../model/jobs.js'

//Create job  ( Only Recruiter Access )
const createJob = async (req, res) => {
    try {
        const recruiterId = req.user.id;
        const { jobTitle, jobDescription, skills, salary, location } = req.body;

        if (!jobTitle || !jobDescription || !skills || !salary || !location) {
            return res.status(404).json(
                {
                    message: 'All fields are required'
                }
            );
        }
        
        const job = await Job.create({
            jobTitle,
            jobDescription,
            skills,
            salary,
            location,
            recruiterId:recruiterId,
        });

        res.status(201).json({
            message: "Job created successfully",
            job
        });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

export default {createJob};