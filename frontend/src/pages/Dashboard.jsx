
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const studentId = localStorage.getItem("studentId");

        if (!studentId) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:5000/dashboard/${studentId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch dashboard");
                }
                return response.json();
            })
            .then((data) => {
                setDashboard(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [navigate]);

    const getSkillIcon = (skill) => {
        const value = skill.toLowerCase().trim();

        const icons = {
            java: "☕",
            python: "🐍",
            react: "⚛️",
            sql: "🗄️",
            mongodb: "🍃",
            javascript: "🟨",
            "node.js": "🟢",
            node: "🟢",
            html: "🌐",
            css: "🎨",
            "c++": "⚙️",
            c: "💻",
            git: "🐙",
            github: "🐙",
            "data structures": "🧠",
            "data structures and algorithms": "🧠",
            spring: "🌱",
            "spring boot": "🌱",
            mysql: "🗄️",
            "rest api": "🔗",
            api: "🔗",
            aws: "☁️",
            docker: "🐳"
        };

        return icons[value] || "💻";
    };

    const analyses = dashboard?.jobAnalysis || [];

    const learningSkills = [];

    analyses.forEach((job) => {
        const missingSkills = job.skillGap?.missingSkills || [];

        missingSkills.forEach((skill) => {
            learningSkills.push({
                skill,
                jobId: job.jobId,
                company: job.company,
                jobTitle: job.jobTitle
            });
        });
    });

    const uniqueSkills = [];
    const skillNames = new Set();

    learningSkills.forEach((item) => {
        const normalized = item.skill.toLowerCase().trim();

        if (!skillNames.has(normalized)) {
            skillNames.add(normalized);
            uniqueSkills.push(item);
        }
    });

    const firstSkillRow = uniqueSkills.filter(
        (_, index) => index % 2 === 0
    );

    const secondSkillRow = uniqueSkills.filter(
        (_, index) => index % 2 !== 0
    );

    const rowOneSkills =
        firstSkillRow.length > 0
            ? [...firstSkillRow, ...firstSkillRow, ...firstSkillRow]
            : [];

    const rowTwoSkills =
        secondSkillRow.length > 0
            ? [...secondSkillRow, ...secondSkillRow, ...secondSkillRow]
            : [];

    const openLearningForSkill = (item) => {
        navigate("/learning", {
            state: {
                jobId: item.jobId,
                company: item.company,
                jobTitle: item.jobTitle,
                selectedSkill: item.skill
            }
        });
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your placement dashboard...</p>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="dashboard-error">
                <h2>Unable to load dashboard</h2>
                <p>Please make sure the backend server is running.</p>

                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    const student = dashboard.student || {};
    const recommendedJobs = dashboard.recommendedJobs || [];
    const studentSkills = student.skills || [];
    const jobsCount = recommendedJobs.length;

    return (
        <div className="dashboard-page">

            {/* SIDEBAR */}
            <aside className="dashboard-sidebar">

                <div className="sidebar-brand">
                    <div className="brand-icon">C</div>

                    <div>
                        <h2>CampusAI</h2>
                        <span>Placement Intelligence</span>
                    </div>
                </div>

                {/* MAIN MENU */}
                <nav className="sidebar-menu">

                    <button
                        className="menu-item active"
                        onClick={() => navigate("/dashboard")}
                    >
                        <span>⌂</span>
                        Dashboard
                    </button>

                    <button
                        className="menu-item"
                        onClick={() => navigate("/jobs")}
                    >
                        <span>▣</span>
                        Jobs
                    </button>

                    <button
                        className="menu-item"
                        onClick={() => navigate("/recommendations")}
                    >
                        <span>✦</span>
                        Recommendations
                    </button>

                    <button
                        className="menu-item"
                        onClick={() => navigate("/skill-gap")}
                    >
                        <span>◇</span>
                        Skill Gap
                    </button>

                    <button
                        className="menu-item"
                        onClick={() => navigate("/learning")}
                    >
                        <span>↗</span>
                        Learning
                    </button>

                </nav>

                {/* BOTTOM AREA */}
                <div className="sidebar-bottom">

                    <div className="sidebar-help">
                        <div className="help-icon">?</div>

                        <div>
                            <strong>Need help?</strong>
                            <span>
                                Explore your placement journey.
                            </span>
                        </div>
                    </div>

                    {/* PROFILE ABOVE LOGOUT */}
                    <button
                        className="menu-item"
                        onClick={() => navigate("/profile")}
                    >
                        <span>◯</span>
                        Profile
                    </button>

                    <button
                        className="logout-button"
                        onClick={() => {
                            localStorage.removeItem("studentId");
                            localStorage.removeItem("studentName");
                            navigate("/login");
                        }}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>

            {/* MAIN CONTENT */}
            <main className="dashboard-main">

                {/* HEADER */}
                <header className="dashboard-header">

                    <div>
                        <p className="header-label">
                            STUDENT DASHBOARD
                        </p>

                        <h1>
                            Welcome back, {student.name || "Student"} 👋
                        </h1>
                    </div>

                    <div className="header-profile">

                        <div className="header-avatar">
                            {(student.name || "S")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <strong>
                                {student.name || "Student"}
                            </strong>

                            <span>
                                {student.department || "IT"}
                            </span>
                        </div>

                    </div>

                </header>

                {/* HERO */}
                <section className="dashboard-hero">

                    <div className="hero-content">

                        <span className="hero-tag">
                            ✦ AI-POWERED PLACEMENT INTELLIGENCE
                        </span>

                        <h2>
                            Build the skills.
                            <br />
                            <span>Reach your dream job.</span>
                        </h2>

                        <p>
                            Your placement journey is personalized using
                            your profile, skills and available opportunities.
                        </p>

                        <div className="hero-actions">

                            <button
                                className="primary-action"
                                onClick={() =>
                                    navigate("/recommendations")
                                }
                            >
                                View Recommendations
                                <span>→</span>
                            </button>

                            <button
                                className="secondary-action"
                                onClick={() =>
                                    navigate("/skill-gap")
                                }
                            >
                                Explore Skill Gap
                            </button>

                        </div>

                    </div>

                    <div className="hero-visual">

                        <div className="hero-orbit orbit-one"></div>
                        <div className="hero-orbit orbit-two"></div>

                        <div className="hero-center">
                            <span>AI</span>
                            <small>READY</small>
                        </div>

                        <div className="floating-dot dot-one"></div>
                        <div className="floating-dot dot-two"></div>
                        <div className="floating-dot dot-three"></div>

                    </div>

                </section>

                {/* SKILLS YOU CAN LEARN */}
                {uniqueSkills.length > 0 && (
                    <section className="learning-skills-section">

                        <div className="section-heading">

                            <div>
                                <span className="section-eyebrow">
                                    PERSONALIZED LEARNING
                                </span>

                                <h2>Skills You Can Learn</h2>

                                <p>
                                    Improve the skills that can strengthen
                                    your placement readiness.
                                </p>
                            </div>

                            <button
                                className="section-link"
                                onClick={() => navigate("/learning")}
                            >
                                View Learning Plan →
                            </button>

                        </div>

                        <div className="skill-marquee">

                            <div className="skill-track skill-track-left">

                                {rowOneSkills.map((item, index) => (
                                    <button
                                        className="floating-skill"
                                        key={`row-one-${item.skill}-${index}`}
                                        onClick={() =>
                                            openLearningForSkill(item)
                                        }
                                    >
                                        <span className="skill-symbol">
                                            {getSkillIcon(item.skill)}
                                        </span>

                                        <span className="skill-name">
                                            {item.skill}
                                        </span>
                                    </button>
                                ))}

                            </div>

                            {rowTwoSkills.length > 0 && (
                                <div className="skill-track skill-track-right">

                                    {rowTwoSkills.map((item, index) => (
                                        <button
                                            className="floating-skill"
                                            key={`row-two-${item.skill}-${index}`}
                                            onClick={() =>
                                                openLearningForSkill(item)
                                            }
                                        >
                                            <span className="skill-symbol">
                                                {getSkillIcon(item.skill)}
                                            </span>

                                            <span className="skill-name">
                                                {item.skill}
                                            </span>
                                        </button>
                                    ))}

                                </div>
                            )}

                        </div>

                    </section>
                )}

                {/* STATISTICS */}
                <section className="dashboard-stats">

                    <div className="stat-item">
                        <div className="stat-icon purple">◎</div>

                        <div>
                            <span>CGPA</span>
                            <strong>
                                {student.cgpa ?? "-"}
                            </strong>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon blue">◆</div>

                        <div>
                            <span>Your Skills</span>
                            <strong>
                                {studentSkills.length}
                            </strong>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon green">✓</div>

                        <div>
                            <span>Arrears</span>
                            <strong>
                                {student.arrears ?? 0}
                            </strong>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon orange">▣</div>

                        <div>
                            <span>Job Matches</span>
                            <strong>{jobsCount}</strong>
                        </div>
                    </div>

                </section>

                {/* CURRENT SKILLS */}
                <section className="current-skills-section">

                    <div className="section-heading">

                        <div>
                            <span className="section-eyebrow">
                                YOUR PROFILE
                            </span>

                            <h2>Current Skills</h2>

                            <p>
                                Skills currently available in your profile.
                            </p>
                        </div>

                        <button
                            className="section-link"
                            onClick={() => navigate("/profile")}
                        >
                            Update Profile →
                        </button>

                    </div>

                    <div className="current-skills-list">

                        {studentSkills.length > 0 ? (
                            studentSkills.map((skill, index) => (
                                <span
                                    className="current-skill"
                                    key={`${skill}-${index}`}
                                >
                                    {getSkillIcon(skill)}
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="empty-skill">
                                No skills added yet.
                            </span>
                        )}

                    </div>

                </section>

                {/* PLACEMENT JOURNEY */}
                <section className="journey-section">

                    <div className="journey-header">

                        <div>
                            <span className="section-eyebrow">
                                YOUR PLACEMENT JOURNEY
                            </span>

                            <h2>
                                Move from profile to readiness
                            </h2>
                        </div>

                    </div>

                    <div className="journey-steps">

                        <button
                            className="journey-step"
                            onClick={() =>
                                navigate("/recommendations")
                            }
                        >
                            <span className="journey-number">
                                01
                            </span>

                            <div>
                                <strong>Discover Jobs</strong>

                                <p>
                                    Find roles that match your profile.
                                </p>
                            </div>

                            <span className="journey-arrow">
                                →
                            </span>
                        </button>

                        <button
                            className="journey-step"
                            onClick={() =>
                                navigate("/skill-gap")
                            }
                        >
                            <span className="journey-number">
                                02
                            </span>

                            <div>
                                <strong>
                                    Understand Skill Gap
                                </strong>

                                <p>
                                    See what each job requires.
                                </p>
                            </div>

                            <span className="journey-arrow">
                                →
                            </span>
                        </button>

                        <button
                            className="journey-step"
                            onClick={() =>
                                navigate("/learning")
                            }
                        >
                            <span className="journey-number">
                                03
                            </span>

                            <div>
                                <strong>Start Learning</strong>

                                <p>
                                    Follow a personalized roadmap.
                                </p>
                            </div>

                            <span className="journey-arrow">
                                →
                            </span>
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;
