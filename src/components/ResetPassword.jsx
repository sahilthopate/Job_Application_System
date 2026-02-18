import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const role = location.state?.role;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const url =
        role === "user"
          ? "http://localhost:5000/auth/update-password"
          : "http://localhost:5000/auth/recruiter/recruiter-update-password";

      await axios.post(url, { 
            email, 
            newPassword:password,
            confirmPassword:confirm
        });

      toast.success("Password reset successful ✅");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Reset failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  from-purple-100 to-indigo-200">
     
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Reset Password
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Create your new secure password 🔐
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              New Password
            </label>

            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-sm text-gray-500"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              type={show ? "text" : "password"}
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow">
            Reset Password
          </button>

        </form>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to Login
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your password is encrypted and secure
        </p>

      </div>
    </div>
  );
}
