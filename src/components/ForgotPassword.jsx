import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const url =
                role === "user"
                    ? "http://localhost:5000/auth/forgot-pass"
                    : "http://localhost:5000/auth/recruiter/recruiter-forgot-password";

            const res = await axios.post(url, { email });
            
            localStorage.setItem("role", role);
            toast.success(res.data.message || "OTP sent successfully");

            navigate("/verify-otp", {
                state: { email, role }
            });

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Server error — please try again"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  from-blue-100 to-indigo-200">

            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
                    Forgot Password
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Enter your email to receive OTP
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Role Selector */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Select Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value="user">User</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                    </div>


                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full text-center border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold cursor-pointer"
                        >
                            Send OTP
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-red-500 transition font-semibold cursor-pointer"
                        >
                            Back
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-400 mt-6">
                    Secure password recovery system 🔐
                </p>
            </div>
        </div>
    );
}
