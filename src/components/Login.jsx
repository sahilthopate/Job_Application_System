import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function Login() {
 const navigate = useNavigate();
  const [role, setRole] = useState("user");

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [recruiterdata, setRecruiterData] = useState({
    email: "",
    password: "",
  });

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRecruiterChange = (e) => {
    setRecruiterData({ ...recruiterdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (role === "user") {
        res = await axios.post(
          "http://localhost:5000/auth/login",
          userData
        );
      } else {
        res = await axios.post(
          "http://localhost:5000/auth/recruiter/recruiter-login",
          recruiterdata
        );
      }
      localStorage.setItem('token',res.data.token);
      localStorage.setItem('role',res.data.role);

      toast.success(res.data.message)
      
      if(res.data.role === 'user'){
        localStorage.setItem("userId",res.data.userId);
        navigate('/user/jobs');
      }else{
        localStorage.setItem("recruiterId",res.data.recruiterId);
        navigate('/recruiter/dashboard');
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  from-blue-900 to-indigo-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Login
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`px-4 py-2 rounded-full font-semibold 
              ${role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
              }`}
          >
            User
          </button>

          <button
            type="button"
            onClick={() => setRole("recruiter")}
            className={`px-4 py-2 rounded-full font-semibold ${role === "recruiter"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
              }`}
          >
            Recruiter
          </button>
        </div>

        {
          role === "user" && (
            <div>
              <input type="email" name="email" placeholder="Email" onChange={handleUserChange} className="w-full text-center  py-1 my-2 border rounded" required />
              <input type="password" name="password" placeholder="Password" onChange={handleUserChange} className="w-full text-center  py-1 my-2 border rounded" required />
            </div>
          )
        }

        {
          role === "recruiter" && (
            <div>
              <input name="email" type="email" placeholder="Company Email" onChange={handleRecruiterChange} className="w-full text-center py-1 my-2 border rounded" required />
              <input name="password" type="password" placeholder="Password" onChange={handleRecruiterChange} className="w-full text-center py-1 my-2 border rounded" required /> 
            </div>
          )
        }

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 my-1.5 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
        <div className="text-center mt-4">
          <span>Didn't have an account ?</span><Link to='/signup' className="text-blue-400 underline">Sign up</Link>
        </div>
      </form>
    </div>
  );
}
