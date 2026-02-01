import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
    const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 p-6 flex items-center gap-6">
          <img
            src={user?.profilePhoto}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white object-cover"
          />

          <div className="text-white">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-blue-100">{user.role || "Sahil Thopate"}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Personal Info */}
          <Section title="Personal Information">
            <Info label="Email" value={user.email} />
            <Info label="Phone" value={user.phoneNumber || "Not added"} />
            <Info label="Location" value={user.location || "Not added"} />
          </Section>

          {/* Education */}
          <Section title="Education">
            <Info label="Degree" value={user.education?.degree || "Not added"} />
            <Info label="College" value={user.education?.college || "Not added"} />
            <Info label="Year" value={user.education?.year || "Not added"} />
          </Section>

          {/* Skills */}
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {user.skills?.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills added</p>
              )}
            </div>
            <div>
              <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 mt-17" onClick={() => { navigate('/user/jobs'); }}>
                Back
              </button>
            </div>
          </Section>

          {/* Actions */}
          <Section title="Actions">
            <div className="flex flex-col gap-3">
              <button
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                onClick={() => navigate("/user/edit-profile")}
              >
                Edit Profile
              </button>

              <button className="border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50">
                Upload Resume
              </button>

              <button
                className="border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
                onClick={() => navigate('/user/changePassword')}
              >
                Change Password
              </button>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

/* Reusable Components */

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
