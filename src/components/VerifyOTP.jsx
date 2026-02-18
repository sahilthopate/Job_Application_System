import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VerifyOTP() {
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResent] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;
    const role = location.state?.role;
    useEffect(() => {
        if (timer <= 0) {
            setCanResent(true);
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email missing. Go back and try again.");
            return;
        }

        try {
            const url =
                role === "user"
                    ? "http://localhost:5000/auth/verify-otp"
                    : "http://localhost:5000/auth/recruiter/recruiter-verify-otp";

            await axios.post(url, { email, otp });

            toast.success("OTP Verified ✅");

            navigate("/reset-password", { state: { email, role } });

        } catch (err) {
            console.log(err);
            toast.error("Invalid OTP");
        }
    };

    const resendOTP = async () => {
        try {
            const url =
                role === "user"
                    ? "http://localhost:5000/auth/forgot-pass"
                    : "http://localhost:5000/auth/recruiter/recruiter-forgot-password";

            await axios.post(url, { email });

            toast.success("OTP resent to email");
            setTimer(30);
            setCanResent(false);
        } catch (err) {
            console.log(err);
            
            toast.error("Failed to resend OTP");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  from-indigo-100 to-blue-200">

            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Verify OTP
                </h2>

                <p className="text-center text-gray-500 mb-6">
                    Enter the OTP sent to your email
                </p>

                <form onSubmit={handleVerify} className="space-y-5">

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Role
                        </label>
                        <input
                            type="text"
                            value={role}
                            className="w-full border rounded-lg p-2 text-center text-xl tracking-widest focus:ring-2 focus:ring-indigo-400 outline-none"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Email
                        </label>
                        <input 
                            type="email" 
                            value={email}
                            className="w-full border rounded-lg p-2 text-center text-xl tracking-widest focus:ring-2 focus:ring-indigo-400 outline-none"
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            OTP Code
                        </label>
                        <input
                            type="text"
                            placeholder="Enter 6 digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={6}
                            className="w-full border rounded-lg p-2 text-center text-xl tracking-widest focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 cursor-pointer text-white py-2 rounded-lg hover:bg-indigo-600 transition font-semibold"
                    >
                        Verify OTP
                    </button>

                    <button
                        type="button"
                        onClick={resendOTP}
                        className={
                            `w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-lime-300 transition cursor-pointer
                ${canResend
                                ? 'bg-gray-200 hover:bg-gray-300'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`
                        }
                    >
                        {canResend
                            ? 'Resend OTP'
                            : `Resend OTP After ${timer}s`
                        }
                    </button>
                </form>

                
                <button
                    onClick={() => navigate("/login")}
                    className="w-full mt-4 text-sm text-gray-500 cursor-pointer hover:text-gray-700"
                >
                    ← Back to Login
                </button>

            </div>
        </div>
    );
}
