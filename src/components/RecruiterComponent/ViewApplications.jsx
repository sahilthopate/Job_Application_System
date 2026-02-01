import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ViewApplications() {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;
    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login again");
                return;
            }

            const res = await axios.get(
                `${API}/auth/recruiter/applications`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setApplications(res.data.applications);
        } catch (error) {
            toast.error("Failed to load applied student data");
        }
    };

    const handleShortlistedApplicant = async (applicationId, status) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `${API}/auth/recruiter/applications/${applicationId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                status === "Shortlisted"
                ? "Candidate Shortlisted successfully"
                : "Candidate Rejected successfully"
            );

            // Update UI instantly
            setApplications((prev) =>
                prev.map((app) =>
                    app._id === applicationId
                        ? { ...app, status }
                        : app
                )
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to update application status");
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between    ">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center ">
                        Applied Candidates
                    </h1>
                </div>

                <button
                    onClick={() => navigate("/recruiter/dashboard")}
                    className=" mb-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
                >
                    ← Back to Dashboard
                </button>

            </div>

            {applications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map((app) => (
                        <div
                            key={app._id}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                        >
                            {/* Applicant Info */}
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    👤 {app.userId?.firstName} {app.userId?.lastName}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    📧 {app.userId?.email}
                                </p>
                            </div>

                            {/* Job Info */}
                            <div className="mb-4">
                                <p className="font-semibold text-blue-600">
                                    📄 {app.jobId?.jobTitle}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    📍 {app.jobId?.location}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="mb-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold
                                        ${app.status === "applied"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : app.status === "shortlisted"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }
                                    `}
                                >
                                    {app.status.toUpperCase()}
                                </span>

                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    className="flex-1 bg-green-600 text-white py-2 cursor-pointer rounded-lg hover:bg-green-700 transition disabled:bg-gray-300"
                                    disabled={app.status !== "Applied"}
                                    onClick={() => handleShortlistedApplicant(app._id, 'Shortlisted')}
                                >
                                    Shortlist
                                </button>

                                <button
                                    className="flex-1 bg-red-600 text-white py-2 cursor-pointer rounded-lg hover:bg-red-700 transition disabled:bg-gray-300"
                                    disabled={app.status !== "Applied"}
                                    onClick={() => handleShortlistedApplicant(app._id, 'Rejected')}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-lg">
                    No applications received yet
                </p>
            )}
        </div>
    );
}
