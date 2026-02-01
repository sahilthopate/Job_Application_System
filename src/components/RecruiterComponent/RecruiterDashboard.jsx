import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [jobsCount, setJobsCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0); 
  const recruiterId = localStorage.getItem("recruiterId");
  const API = import.meta.env.VITE_API_URL;
  const fetchMyJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const res = await axios.get(
        `${API}/auth/recruiter/jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJobsCount(res.data.jobs.length);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load jobs");
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
          
      if ( !token) {
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

      setApplicationCount(res.data.applications.length);
    } catch (error) {
      console.log(error);
      
      toast.error("Failed to load applied student data");
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      <aside className="w-64 bg-blue-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Recruiter Panel</h2>

        <ul className="space-y-4">
          <li className="cursor-pointer hover:text-blue-300">
            Dashboard
          </li>
          <li
            className="cursor-pointer hover:text-blue-300"
            onClick={() => navigate("/recruiter/create-post")}
          >
            Post New Job
          </li>
          <li
            className="cursor-pointer hover:text-blue-300"
            onClick={() => navigate("/recruiter/jobs")}
          >
            My Jobs
          </li>
          <li
            className="cursor-pointer hover:text-blue-300"
            onClick={() => navigate("/recruiter/applications")}
          >
            Applications
          </li>
          <li className="cursor-pointer text-red-400 hover:text-red-600" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('recruiterId');
            navigate('/login');
            toast.error('Logout Successfully');
          }}>
            Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, Recruiter 👋</h1>
          <p className="text-gray-600">Manage jobs and applicants efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">Total Jobs</h3>
            <p className="text-3xl font-bold text-blue-700">{jobsCount}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">Applications</h3>
            <p className="text-3xl font-bold text-green-600">{applicationCount}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">Shortlisted</h3>
            <p className="text-3xl font-bold text-purple-600">8</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">Rejected</h3>
            <p className="text-3xl font-bold text-purple-600">8</p>
          </div>
        </div>

        {/* Job List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recently Posted Jobs</h2>

          <div className="space-y-4">
            <div className="border p-4 rounded flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Frontend Developer</h3>
                <p className="text-sm text-gray-500">Bangalore • ₹8 LPA</p>
              </div>
              <button className="text-blue-600 hover:underline">
                View Applications
              </button>
            </div>

            <div className="border p-4 rounded flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Backend Developer</h3>
                <p className="text-sm text-gray-500">Remote • ₹10 LPA</p>
              </div>
              <button className="text-blue-600 hover:underline">
                View Applications
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
