import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Recruiter } from "../contexAPI/RecriuterContext";

export default function MyPostedJob() {
    const [myJobData, setMyJobData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {setJobsCount} = useContext(Recruiter);

    const fetchMyJobs = async () => {
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

            setMyJobData(res.data.jobs);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const handleDelete = async (jobId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:5000/auth/recruiter/jobs/${jobId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Job deleted successfully");

            // ✅ Update UI instantly
            setMyJobData((prev) =>
                prev.filter((job) => job._id !== jobId)
            );

            // ✅ Update context count
            setJobsCount((prev) => prev - 1);

        } catch (error) {
            console.error(error);
            toast.error("Failed to delete job");
        }
    };


    if (loading) {
        return <p className="text-center mt-10">Loading jobs...</p>;
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between    ">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center ">
                        My Posted Jobs
                    </h1>
                </div>

                <button
                    onClick={() => navigate("/recruiter/dashboard")}
                    className=" mb-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
                >
                    ← Back to Dashboard
                </button>

            </div>


            {myJobData.length === 0 ? (
                <div className="text-center bg-white p-10 rounded-lg shadow">
                    <p className="text-gray-600 text-lg">
                        You haven’t posted any jobs yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myJobData.map((job) => (
                        <div
                            key={job._id}
                            className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
                        >
                            {/* Job Title */}
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {job.jobTitle}
                            </h2>

                            {/* Location & Salary */}
                            <p className="text-sm text-gray-500 mb-3">
                                {job.location || "Remote"} • ₹{job.salary || "Not Disclosed"}
                            </p>

                            {/* Description */}
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                {job.jobDescription}
                            </p>

                            {/* Status Badge */}
                            <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 mb-4">
                                Active
                            </span>

                            {/* Actions */}
                            <div className="flex justify-between items-center mt-4">
                                <button 
                                    className="text-blue-600 hover:underline text-sm cursor-pointer"
                                    onClick={()=>navigate('/recruiter/applications')}
                                >
                                    View Applications
                                </button>

                                <div className="space-x-3">
                                    <button
                                        className="text-green-600 hover:underline text-sm cursor-pointer"
                                        onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="text-red-600 hover:underline text-sm cursor-pointer"
                                        onClick={() => handleDelete(job._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
