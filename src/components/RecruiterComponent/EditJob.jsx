import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditJob() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState({
        jobTitle: "",
        jobDescription: "",
        skills: [],
        location: "",
        salary: "",
    });


    const fetchJob = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login again");
                return;
            }

            const res = await axios.get(
                `http://localhost:5000/auth/recruiter/jobs`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setJobData(res.data.jobs);
            
        } catch (error) {
            console.log(error);
            // toast.error("Failed to load jobs");
        }
    };


    useEffect(() => {
        fetchJob();
    }, [jobId]);


    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                `http://localhost:5000/auth/recruiter/${jobId}/edit`,
                jobData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Job updated successfully");
            navigate("/recruiter/jobs");
        } catch (error) {
            toast.error("Failed to update job");
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Job</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
                <input
                    name="jobTitle"
                    value={jobData.jobTitle}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    placeholder="Job Title"
                />

                <textarea
                    name="jobDescription"
                    value={jobData.jobDescription}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    rows="4"
                    placeholder="Job Description"
                />

                <input
                    name="skills"
                    value={jobData.skills}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    placeholder="Skills"
                />
                <input
                    name="location"
                    value={jobData.location}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    placeholder="Location"
                />

                <input
                    type="number"
                    name="salary"
                    value={jobData.salary}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    placeholder="Salary"
                />

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
