import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    location: "",
    degree: "",
    college: "",
    year: "",
    skills: "",
    profilePhoto: "",
  });

  const [loading, setLoading] = useState(false);
    const API = import.meta.env.VITE_API_URL;

  /* ================= FETCH USER DATA ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data.user;

        setFormData({
          name: user.name || "",
          phoneNumber: user.phoneNumber || "",
          location: user.location || "",
          degree: user.education?.degree || "",
          college: user.education?.college || "",
          year: user.education?.year || "",
          skills: user.skills?.join(", ") || "",
          profilePhoto: user.profilePhoto || "",
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        profilePhoto: formData.profilePhoto,
        education: {
          degree: formData.degree,
          college: formData.college,
          year: formData.year,
        },
        skills: formData.skills.split(",").map(skill => skill.trim()),
      };

      const res = await axios.put(
        `${API}/auth/profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      navigate("/user/profile");
    } catch (error) {
      console.log(error);
      toast.error("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
          <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
          <Input label="Profile Photo URL" name="profilePhoto" value={formData.profilePhoto} onChange={handleChange} />

          <hr />

          <h2 className="font-semibold text-gray-700">Education</h2>

          <Input label="Degree" name="degree" value={formData.degree} onChange={handleChange} />
          <Input label="College" name="college" value={formData.college} onChange={handleChange} />
          <Input label="Passing Year" name="year" value={formData.year} onChange={handleChange} />

          <hr />

          <Input
            label="Skills (comma separated)"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
          />

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/user/profile")}
              className="border px-6 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* ================= REUSABLE INPUT ================= */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
