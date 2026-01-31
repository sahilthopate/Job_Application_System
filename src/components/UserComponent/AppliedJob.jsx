import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AppliedJob() {
    const [appliedJob, setAppliedJob] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const getAppliedJob = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "http://localhost:5000/auth/applied-jobs",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setAppliedJob(res.data.applications);
            } catch (error) {
                toast.error("Failed to fetch applied jobs");
            }
        };

        getAppliedJob();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Page Title */}
            <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Applied Jobs
            </h1>

            {/* Job List */}
            {appliedJob.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appliedJob.map((app) => (
                        <div
                            key={app._id}
                            className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border"
                        >
                            {/* Job Title */}
                            <h2 className="text-lg font-semibold text-blue-700 mb-2">
                                {app.jobId.jobTitle}
                            </h2>

                            {/* Job Info */}
                            <p className="text-sm text-gray-600">
                                📍 {app.jobId.location}
                            </p>

                            <p className="text-sm text-gray-600">
                                💰 ₹ {app.jobId.salary}
                            </p>

                            {/* Status */}
                            <div className="mt-4">
                                <span className="text-sm font-medium text-gray-700">
                                    Status:
                                </span>
                                <span
                                    className={`ml-2 px-3 py-1 text-xs rounded-full font-semibold
                    ${app.status === "Applied"
                                            ? "bg-blue-100 text-blue-700"
                                            : app.status === "Shortlisted"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {app.status}
                                </span>
                            </div>

                            {/* Applied Date */}
                            <p className="text-xs text-gray-400 mt-3">
                                Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center mt-20">
                    <p className="text-3xl text-red-500">
                        You haven’t applied to any jobs yet
                    </p>
                    <button 
                        onClick={()=>{navigate(-1)}}
                        className=" my-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition cursor-pointer"
                    >Back</button>
                </div>
            )}
        </div>
    );
}
