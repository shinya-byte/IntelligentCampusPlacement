import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();

    const [student, setStudent] = useState({
        name: "",
        email: "",
        department: "",
        cgpa: "",
        arrears: 0,
        skills: [],
        project: "",
        certifications: ""
    });

    const [newSkill, setNewSkill] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const studentId = localStorage.getItem("studentId");

        if (!studentId) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:5000/students/${studentId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to load profile");
                }

                return response.json();
            })
            .then((data) => {
                setStudent({
                    ...data,
                    skills: data.skills || []
                });

                setLoading(false);
            })
            .catch((error) => {
                console.error("Profile error:", error);
                setLoading(false);
            });
    }, [navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setStudent((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const addSkill = () => {
        const skill = newSkill.trim();

        if (!skill) return;

        const alreadyExists = student.skills.some(
            (existingSkill) =>
                String(existingSkill).toLowerCase() ===
                skill.toLowerCase()
        );

        if (!alreadyExists) {
            setStudent((previous) => ({
                ...previous,
                skills: [...previous.skills, skill]
            }));
        }

        setNewSkill("");
    };

    const handleSkillKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addSkill();
        }
    };

    const removeSkill = (skillToRemove) => {
        setStudent((previous) => ({
            ...previous,
            skills: previous.skills.filter(
                (skill) => skill !== skillToRemove
            )
        }));
    };

    const saveProfile = () => {
        const studentId = localStorage.getItem("studentId");

        setSaving(true);
        setMessage("");

        fetch(`http://localhost:5000/students/${studentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Profile update failed");
                }

                return response.json();
            })
            .then(() => {
                setMessage("Profile updated successfully!");
                setSaving(false);

                setTimeout(() => {
                    setMessage("");
                }, 3000);
            })
            .catch((error) => {
                console.error("Update error:", error);
                setMessage("Unable to update profile.");
                setSaving(false);
            });
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="profile-loader"></div>
                <h3>Loading your profile...</h3>
            </div>
        );
    }

    return (
        <div className="profile-page">

            {/* ================= HEADER ================= */}

            <header className="profile-topbar">

                <div className="profile-brand">

                    <div className="profile-brand-icon">
                        🎓
                    </div>

                    <div>
                        <h2>CampusAI</h2>
                        <span>Placement Intelligence</span>
                    </div>

                </div>

                <button
                    className="dashboard-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </header>


            {/* ================= MAIN ================= */}

            <main className="profile-container">

                <div className="profile-heading">

                    <div>

                        <span className="profile-label">
                            STUDENT PROFILE
                        </span>

                        <h1>
                            My Placement Profile
                        </h1>

                        <p>
                            Keep your academic and technical information
                            updated for better placement recommendations.
                        </p>

                    </div>

                    <div className="profile-status">
                        <span>●</span>
                        Profile Active
                    </div>

                </div>


                {/* ================= PROFILE CARD ================= */}

                <section className="profile-card">

                    <div className="profile-card-header">

                        <div className="large-avatar">
                            {student.name
                                ?.charAt(0)
                                .toUpperCase() || "S"}
                        </div>

                        <div>

                            <h2>
                                {student.name || "Student"}
                            </h2>

                            <p>
                                {student.department ||
                                    "Department not added"}
                            </p>

                            <span>
                                Placement Candidate
                            </span>

                        </div>

                    </div>


                    {/* ================= BASIC INFORMATION ================= */}

                    <div className="profile-section">

                        <div className="section-title">

                            <div className="section-icon blue">
                                👤
                            </div>

                            <div>
                                <h3>
                                    Basic Information
                                </h3>

                                <p>
                                    Your personal and academic details
                                </p>
                            </div>

                        </div>


                        <div className="profile-form-grid">

                            <div className="form-group">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    name="name"
                                    value={student.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    name="email"
                                    type="email"
                                    value={student.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Department
                                </label>

                                <input
                                    name="department"
                                    value={student.department}
                                    onChange={handleChange}
                                    placeholder="Example: IT"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    CGPA
                                </label>

                                <input
                                    name="cgpa"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={student.cgpa}
                                    onChange={handleChange}
                                    placeholder="Example: 8.7"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Active Arrears
                                </label>

                                <input
                                    name="arrears"
                                    type="number"
                                    min="0"
                                    value={student.arrears}
                                    onChange={handleChange}
                                    placeholder="0"
                                />

                            </div>

                        </div>

                    </div>


                    {/* ================= SKILLS ================= */}

                    <div className="profile-section">

                        <div className="section-title">

                            <div className="section-icon purple">
                                ⚡
                            </div>

                            <div>

                                <h3>
                                    Technical Skills
                                </h3>

                                <p>
                                    Add skills used for job matching
                                </p>

                            </div>

                        </div>


                        <div className="skills-editor">

                            {student.skills.length > 0 ? (

                                student.skills.map(
                                    (skill, index) => (

                                        <div
                                            className="profile-skill"
                                            key={index}
                                        >

                                            <span>
                                                ✓ {skill}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSkill(skill)
                                                }
                                                aria-label={`Remove ${skill}`}
                                            >
                                                ×
                                            </button>

                                        </div>

                                    )
                                )

                            ) : (

                                <p className="no-skills">
                                    No skills added yet. Add your
                                    technical skills below.
                                </p>

                            )}

                        </div>


                        <div className="add-skill-row">

                            <input
                                placeholder="Enter a skill (Example: Java)"
                                value={newSkill}
                                onChange={(event) =>
                                    setNewSkill(event.target.value)
                                }
                                onKeyDown={handleSkillKeyDown}
                            />

                            <button
                                type="button"
                                className="add-skill-button"
                                onClick={addSkill}
                            >
                                + Add Skill
                            </button>

                        </div>

                        <small className="skill-hint">
                            Press Enter or click Add Skill
                        </small>

                    </div>


                    {/* ================= PROJECT & CERTIFICATION ================= */}

                    <div className="profile-section">

                        <div className="section-title">

                            <div className="section-icon orange">
                                🚀
                            </div>

                            <div>

                                <h3>
                                    Projects & Certifications
                                </h3>

                                <p>
                                    Highlight your practical experience
                                </p>

                            </div>

                        </div>


                        <div className="profile-form-grid">

                            <div className="form-group full-width">

                                <label>
                                    Main Project
                                </label>

                                <input
                                    name="project"
                                    value={student.project || ""}
                                    onChange={handleChange}
                                    placeholder="Example: Intelligent Campus Placement System"
                                />

                            </div>


                            <div className="form-group full-width">

                                <label>
                                    Certifications
                                </label>

                                <input
                                    name="certifications"
                                    value={
                                        student.certifications || ""
                                    }
                                    onChange={handleChange}
                                    placeholder="Example: NPTEL Python"
                                />

                            </div>

                        </div>

                    </div>


                    {/* ================= PROFILE SUMMARY ================= */}

                    <div className="profile-summary">

                        <div className="summary-item">

                            <span>
                                🎯
                            </span>

                            <div>
                                <strong>
                                    CGPA
                                </strong>

                                <p>
                                    {student.cgpa || "Not added"}
                                </p>
                            </div>

                        </div>


                        <div className="summary-item">

                            <span>
                                ⚡
                            </span>

                            <div>
                                <strong>
                                    Skills
                                </strong>

                                <p>
                                    {student.skills.length} added
                                </p>
                            </div>

                        </div>


                        <div className="summary-item">

                            <span>
                                📋
                            </span>

                            <div>
                                <strong>
                                    Arrears
                                </strong>

                                <p>
                                    {student.arrears ?? 0}
                                </p>
                            </div>

                        </div>


                        <div className="summary-item">

                            <span>
                                📜
                            </span>

                            <div>
                                <strong>
                                    Certification
                                </strong>

                                <p>
                                    {student.certifications
                                        ? "Added"
                                        : "Not added"}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* ================= SAVE ================= */}

                    <div className="profile-actions">

                        {message && (
                            <div
                                className={
                                    message.includes("successfully")
                                        ? "save-message success"
                                        : "save-message error"
                                }
                            >
                                {message.includes("successfully")
                                    ? "✓"
                                    : "⚠️"}{" "}
                                {message}
                            </div>
                        )}

                        <button
                            className="save-profile-button"
                            onClick={saveProfile}
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "✓ Save Profile"}
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Profile;