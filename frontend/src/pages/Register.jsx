import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        department: "",
        cgpa: "",
        skills: "",
        projects: "",
        certifications: "",
        arrears: "0"
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    department: formData.department,
                    cgpa: Number(formData.cgpa),

                    skills: formData.skills
                        .split(",")
                        .map(skill => skill.trim())
                        .filter(skill => skill !== ""),

                    projects: formData.projects
                        .split(",")
                        .map(project => project.trim())
                        .filter(project => project !== ""),

                    certifications: formData.certifications
                        .split(",")
                        .map(certification => certification.trim())
                        .filter(certification => certification !== ""),

                    arrears: Number(formData.arrears)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Registration failed");
                return;
            }

            alert("Registration successful!");

            navigate("/login");

        } catch (error) {
            setMessage("Backend server is not running");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card register-card">

                <h1>Intelligent Campus Placement</h1>
                <h2>Student Registration</h2>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="department"
                        placeholder="Department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="cgpa"
                        placeholder="CGPA"
                        step="0.01"
                        value={formData.cgpa}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="skills"
                        placeholder="Skills (Java, Python, SQL)"
                        value={formData.skills}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="projects"
                        placeholder="Projects (Project 1, Project 2)"
                        value={formData.projects}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="certifications"
                        placeholder="Certifications (NPTEL, AWS)"
                        value={formData.certifications}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="arrears"
                        placeholder="Arrears"
                        min="0"
                        value={formData.arrears}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Register
                    </button>

                </form>

                {message && (
                    <p className="auth-message">
                        {message}
                    </p>
                )}

                <p>
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>

            </div>
        </div>
    );
}

export default Register;