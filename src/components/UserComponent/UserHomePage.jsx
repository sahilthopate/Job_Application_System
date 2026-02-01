import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserHomePage() {
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const API = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `${API}/auth/jobs`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                    },
                );
                setJobs(res.data.jobs);
                setAppliedJobIds(res.data.appliedJobIds);
            } catch (error) {
                console.log(error);
                toast.error("Failed to load jobs");
            }
        };

        fetchJobs();
    }, []);


    const handleApplyJob = async (jobId) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login first");
                navigate("/login");
                return;
            }

            const res = await axios.post(
                `${API}/auth/jobs/apply/${jobId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message);
            setAppliedJobIds(prev => [...prev, jobId]);
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message || "Failed to apply"
            );
        }
    };


    return (
        <div className="flex min-h-screen bg-gray-100">

            <aside className="w-64 bg-white shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-8 text-blue-600">
                    Job Portal
                </h2>

                <ul className="space-y-4 text-gray-700">
                    <li className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition">
                        📄 <span>All Jobs</span>
                    </li>

                    <li
                        className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition"
                        onClick={() => { navigate('/user/applied-jobs') }}
                    >
                        ✅ <span>Applied Jobs</span>
                    </li>

                    <li>
                        <div
                            className="flex items-center gap-3 cursor-pointer p-2 rounded 
               hover:bg-blue-50 hover:text-blue-600 transition"
                            onClick={() => setShowProfileMenu(prev => !prev)}
                        >
                            👤 <span>Profile</span>
                        </div>

                        {showProfileMenu && (
                            <ul className="ml-8 mt-2 space-y-2 text-sm text-gray-600">

                                <li
                                    className="cursor-pointer p-2 rounded hover:bg-gray-100"
                                    onClick={() => navigate("/user/profile")}
                                >
                                    ➤ My Profile
                                </li>

                                <li
                                    className="cursor-pointer p-2 rounded hover:bg-gray-100"
                                    onClick={() => navigate('/user/changePassword')}
                                >
                                    ➤ Change Password
                                </li>

                                <li
                                    className="cursor-pointer p-2 rounded hover:bg-gray-100"
                                    onClick={() => navigate("/user/resume")}
                                >
                                    ➤ Resume
                                </li>

                                <li
                                    className="cursor-pointer p-2 rounded text-red-500 hover:bg-red-50"
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        localStorage.removeItem("role");
                                        localStorage.removeItem('userId');
                                        toast.success("Logout Successfully");
                                        navigate("/login");
                                    }}
                                    >
                                    ➤ Logout
                                </li>

                            </ul>
                        )}
                    </li>

                    {
                        !showProfileMenu && (
                            <li className="flex items-center gap-3 cursor-pointer p-2 rounded text-red-500 hover:bg-red-50 transition">
                                🚪 <span onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("role");
                                    localStorage.removeItem('userId');
                                    navigate('/login')
                                    toast.error('Logout Successfully');
                                }
                                }>Logout</span>
                            </li>
                        )
                    }

                </ul>
            </aside>


            <main className="flex-1 p-8">

                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Available Jobs
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div
                                key={job._id}
                                className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
                            >
                                <div>
                                    <h2 className="font-bold text-lg text-blue-600">
                                        {job.jobTitle}
                                    </h2>

                                    <p className="text-gray-600 text-md mt-2">
                                        <span className="font-bold">{job.recruiterId.companyName}</span>
                                    </p>

                                    <p className="text-gray-600 text-md mt-2">
                                        {job.jobDescription}
                                    </p>

                                    <p className="text-gray-800 mt-3">
                                        <span className="font-semibold">Location: </span>📍 {job.location}
                                    </p>

                                    <p className=" text-gray-800 mt-3">
                                        <span className="font-semibold">Required Skills: </span>💰 ₹ {job.skills?.join(' , ')}
                                    </p>
                                    <p className=" text-gray-800 mt-3">
                                        <span className="font-semibold">Salary: </span>💰 ₹ {job.salary}
                                    </p>
                                </div>

                                <button
                                    disabled={appliedJobIds.includes(job._id)}
                                    onClick={() => handleApplyJob(job._id)}
                                    className={`mt-4 py-2 rounded-lg transition font-semibold cursor-pointer
                                        ${appliedJobIds.includes(job._id)
                                            ? "bg-gray-400 cursor-not-allowed text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }
                                    `}
                                >
                                    {appliedJobIds.includes(job._id) ? "Applied" : "Apply Now"}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No jobs found</p>
                    )}
                </div>

            </main>
        </div>

    )
}