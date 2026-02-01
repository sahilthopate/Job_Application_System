import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [recruiterdata, setRecruiterData] = useState({
    companyName: "",
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
      if (role === "user") {
        const res = await axios.post(
          "http://localhost:5000/auth/signup",
          userData
        );
        toast.success(res.data.message);
      } else {
        const res = await axios.post(
          "http://localhost:5000/auth/recruiter/recruiter-signup",
          recruiterdata
        );
        toast.success(res.data.message);
      }

      navigate("/login");
    } catch (error) {
      console.log(error);
      
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  from-blue-900 to-indigo-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Create Account
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
            <div className="flex-col ">
              <input type="text" name="firstName" placeholder="First Name" onChange={handleUserChange} className="w-full text-center py-1 my-2 border rounded" required />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleUserChange} className="w-full text-center  py-1 my-2 border rounded" required />
              <input type="tel" name="phone" placeholder="Phone" onChange={handleUserChange} className="w-full text-center  py-1 my-2 border rounded" required />
              <input type="email" name="email" placeholder="Email" onChange={handleUserChange} className="w-full text-center  py-1 my-2 border rounded" required />
              <input type="password" name="password" placeholder="Password" onChange={handleUserChange} className="w-full text-center  py-1 my-2 border rounded" required />
            </div>
          )
        }

        {
          role === "recruiter" && (
            <div>
              <input name="companyName" placeholder="Company Name" onChange={handleRecruiterChange} className="w-full text-center py-1 my-2 border rounded" required />
              <input name="email" type="email" placeholder="Company Email" onChange={handleRecruiterChange} className="w-full text-center py-1 my-2 border rounded" required />
              <input name="password" type="password" placeholder="Password" onChange={handleRecruiterChange} className="w-full text-center py-1 my-2 border rounded" required /> 
            </div>
          )
        }

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 my-1.5 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
        <div className="text-center mt-4">
          <span>Already have an account ? </span><Link to='/login' className="text-blue-400 underline">login</Link>
        </div>
      </form>
    </div>
  );
}
