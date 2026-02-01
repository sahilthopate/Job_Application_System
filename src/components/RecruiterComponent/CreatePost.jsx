import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const skillSuggestions = [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "Tailwind",
    "Java",
    "Python",
    "AWS",
];

export default function CreateJob() {
    const [jobData, setJobData] = useState({
        jobTitle: "",
        jobDescription: "",
        location: "",
        salary: "",
        skills: [],
    });
    
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;
    const [skillInput, setSkillInput] = useState("");

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    /* Add skill */
    const addSkill = (skill) => {
        if (!jobData.skills.includes(skill)) {
            setJobData({
                ...jobData,
                skills: [...jobData.skills, skill],
            });
        }
        setSkillInput("");
    };

    /* Remove skill */
    const removeSkill = (skill) => {
        setJobData({
            ...jobData,
            skills: jobData.skills.filter((s) => s !== skill),
        });
    };

    /* Enter key add skill */
    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            addSkill(skillInput.trim());
        }
    };

    /* Submit job */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            
            await axios.post(
                `${API}/api/jobs/create-post`,
                jobData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Job posted successfully!");

            navigate('/recruiter/dashboard');
        } catch (error) {
            console.log(error);
            
            toast.error(error.response?.data?.message || "Failed to create job");
        }
    };

    /* Filter suggestions */
    const filteredSkills = skillSuggestions.filter(
        (skill) =>
            skill.toLowerCase().includes(skillInput.toLowerCase()) &&
            !jobData.skills.includes(skill)
    );

    return (
        <div className="max-w-2xl my-10 mx-auto  bg-white p-6 rounded-lg shadow ">
            <h2 className="text-5xl font-bold mb-6 text-center">Create Job</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    className="w-full border p-2 rounded"
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="jobDescription"
                    placeholder="Job Description"
                    className="w-full border p-2 rounded"
                    rows="4"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    className="w-full border p-2 rounded"
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="salary"
                    placeholder="Salary"
                    className="w-full border p-2 rounded"
                    onChange={handleChange}
                />

                {/* Skills Input */}
                <div>
                    <label className="font-semibold">Skills</label>

                    <input
                        type="text"
                        placeholder="Type a skill and press Enter"
                        className="w-full border p-2 rounded mt-1"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                    />

                    {/* Suggestions */}
                    {skillInput && filteredSkills.length > 0 && (
                        <div className="border rounded mt-2 bg-white shadow">
                            {filteredSkills.map((skill) => (
                                <div
                                    key={skill}
                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => addSkill(skill)}
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Selected Skills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {jobData.skills.map((skill) => (
                            <span
                                key={skill}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
                            >
                                {skill}
                                <button
                                    type="button"
                                    className="text-red-500 font-bold"
                                    onClick={() => removeSkill(skill)}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between gap-4">
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Post Job
                    </button>
                    <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700" onClick={()=>{navigate('/recruiter/dashboard');}}>
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
}