import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (formData.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:5000/auth/changepassword",
                {
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(res.data.message || "Password updated successfully");
            navigate(-1);
        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message || "Failed to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    Change Password
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 border py-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
