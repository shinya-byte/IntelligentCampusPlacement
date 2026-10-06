
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        const cleanEmail = email.trim();

        try {
            const response = await fetch(
                "http://localhost:5000/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: cleanEmail,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Invalid email or password"
                );
                return;
            }

            localStorage.setItem(
                "studentId",
                data.studentId
            );

            localStorage.setItem(
                "studentName",
                data.name
            );

            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);

            setMessage(
                "Unable to connect to the backend server"
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1>Intelligent Campus Placement</h1>

                <h2>Student Login</h2>

                <form onSubmit={handleLogin}>

                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>

                {message && (
                    <p className="auth-message">
                        {message}
                    </p>
                )}

                <p>
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;
