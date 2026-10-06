import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Recommendations.css";

function Recommendations() {
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
                    throw new Error("Failed to load recommendations");
                }

                return response.json();
            })
            .then((data) => {
                setDashboard(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Recommendations error:", error);
                setLoading(false);
            });
    }, [navigate]);

    const formatDate = (date) => {
        if (!date) {
            return "Not specified";
        }

        const formatted = new Date(date);

        if (Number.isNaN(formatted.getTime())) {
            return "Not specified";
        }

        return formatted.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getMatchPercentage = (job) => {
        return Number(
            job?.skillGap?.matchPercentage ??
            job?.matchPercentage ??
            0
        );
    };

    const getReadinessScore = (job) => {
        return Number(
            job?.readiness?.readinessScore ?? 0
        );
    };

    const getReadinessLabel = (score) => {
        if (score >= 85) {
            return "Excellent";
        }

        if (score >= 70) {
            return "Good";
        }

        if (score >= 50) {
            return "Needs Improvement";
        }

        return "Low";
    };

    const getReadinessClass = (score) => {
        if (score >= 85) {
            return "excellent";
        }

        if (score >= 70) {
            return "good";
        }

        if (score >= 50) {
            return "improvement";
        }

        return "low";
    };

    const handleSkillGap = (job) => {
        navigate("/skill-gap", {
            state: {
                jobId: job.jobId,
                company: job.company,
                jobTitle: job.jobTitle
            }
        });
    };

    const handleLearning = (job) => {
        navigate("/learning", {
            state: {
                jobId: job.jobId,
                company: job.company,
                jobTitle: job.jobTitle,
                missingSkills:
                    job.skillGap?.missingSkills || []
            }
        });
    };

    if (loading) {
        return (
            <div className="recommendation-loading">
                <div className="recommendation-loader"></div>

                <h3>
                    Finding your best opportunities...
                </h3>

                <p>
                    CampusAI is analysing your profile and available jobs.
                </p>
            </div>
        );
    }

    if (!dashboard || !dashboard.student) {
        return (
            <div className="recommendation-error">
                <div className="recommendation-error-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to load recommendations
                </h2>

                <p>
                    Please make sure the backend server is running.
                </p>

                <div className="error-actions">
                    <button
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const student = dashboard.student;

    /*
     * Only eligible jobs are shown as recommendations.
     */
    const recommendations = (dashboard.jobAnalysis || [])
        .filter(
            (job) =>
                job?.eligibility?.eligible === true
        )
        .sort(
            (a, b) =>
                getMatchPercentage(b) -
                getMatchPercentage(a)
        );

    return (
        <div className="recommendation-page">

            {/* ================= SIDEBAR ================= */}

            <aside className="recommendation-sidebar">

                <div className="recommendation-brand">

                    <div className="recommendation-brand-icon">
                        🎓
                    </div>

                    <div>
                        <h2>
                            CampusAI
                        </h2>

                        <span>
                            Placement Intelligence
                        </span>
                    </div>

                </div>

                <div className="recommendation-profile">

                    <div className="recommendation-avatar">
                        {student.name
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <h3>
                            {student.name}
                        </h3>

                        <p>
                            {student.department}
                        </p>
                    </div>

                </div>

                <nav className="recommendation-nav">

                    <button
                        onClick={() => navigate("/dashboard")}
                    >
                        <span>📊</span>
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/jobs")}
                    >
                        <span>💼</span>
                        Jobs
                    </button>

                    <button
                        onClick={() => navigate("/profile")}
                    >
                        <span>👤</span>
                        Profile
                    </button>

                    <button
                        className="recommendation-active"
                        onClick={() =>
                            navigate("/recommendations")
                        }
                    >
                        <span>🎯</span>
                        Recommendations
                    </button>

                    <button
                        onClick={() => navigate("/skill-gap")}
                    >
                        <span>🧠</span>
                        Skill Gap
                    </button>

                    <button
                        onClick={() => navigate("/learning")}
                    >
                        <span>📚</span>
                        Learning
                    </button>

                </nav>

                <div className="recommendation-sidebar-bottom">

                    <div className="recommendation-tip">

                        <div className="tip-icon">
                            💡
                        </div>

                        <div>
                            <strong>
                                Smart Matching
                            </strong>

                            <p>
                                Jobs are ranked according to
                                your current profile match.
                            </p>
                        </div>

                    </div>

                    <button
                        className="recommendation-logout"
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

            {/* ================= MAIN ================= */}

            <main className="recommendation-main">

                {/* HEADER */}

                <header className="recommendation-header">

                    <div className="recommendation-header-content">

                        <div className="recommendation-eyebrow">
                            <span>✦</span>
                            AI POWERED JOB MATCHING
                        </div>

                        <h1>
                            Your Job
                            <span> Recommendations</span>
                        </h1>

                        <p>
                            Discover opportunities that match your
                            academic profile, technical skills and
                            placement eligibility.
                        </p>

                    </div>

                    <div className="recommendation-count-card">

                        <div className="count-icon">
                            🎯
                        </div>

                        <div>
                            <strong>
                                {recommendations.length}
                            </strong>

                            <span>
                                Eligible Jobs
                            </span>
                        </div>

                    </div>

                </header>

                {/* PROFILE SNAPSHOT */}

                <section className="profile-snapshot">

                    <div className="snapshot-title">
                        <span>👋</span>

                        <div>
                            <strong>
                                Hi, {student.name}
                            </strong>

                            <p>
                                Here is your personalised placement
                                recommendation based on your profile.
                            </p>
                        </div>
                    </div>

                    <div className="snapshot-stats">

                        <div className="snapshot-stat">
                            <span>Department</span>
                            <strong>
                                {student.department || "N/A"}
                            </strong>
                        </div>

                        <div className="snapshot-stat">
                            <span>CGPA</span>
                            <strong>
                                {student.cgpa ?? "N/A"}
                            </strong>
                        </div>

                        <div className="snapshot-stat">
                            <span>Skills</span>
                            <strong>
                                {student.skills?.length || 0}
                            </strong>
                        </div>

                        <div className="snapshot-stat">
                            <span>Arrears</span>
                            <strong>
                                {student.arrears ?? 0}
                            </strong>
                        </div>

                    </div>

                </section>

                {/* SECTION HEADER */}

                <section className="recommendation-section-header">

                    <div>
                        <span>
                            PERSONALIZED MATCHES
                        </span>

                        <h2>
                            Jobs Recommended For You
                        </h2>

                        <p>
                            These jobs currently satisfy your
                            placement eligibility requirements.
                        </p>
                    </div>

                    <div className="ranking-info">
                        <span>↕</span>
                        Ranked by skill compatibility
                    </div>

                </section>

                {/* ================= JOBS ================= */}

                {recommendations.length === 0 ? (

                    <section className="recommendation-empty">

                        <div className="empty-icon">
                            🔎
                        </div>

                        <h2>
                            No eligible jobs found
                        </h2>

                        <p>
                            We could not find a job that currently
                            satisfies your eligibility requirements.
                            Check your skill gap to see what you can
                            improve.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/skill-gap")
                            }
                        >
                            View Skill Gap →
                        </button>

                    </section>

                ) : (

                    <section className="recommendation-job-grid">

                        {recommendations.map((job, index) => {

                            const match =
                                getMatchPercentage(job);

                            const readiness =
                                getReadinessScore(job);

                            const missingSkills =
                                job.skillGap?.missingSkills || [];

                            const matchedSkills =
                                job.skillGap?.matchedSkills || [];

                            const requiredSkills =
                                job.requiredSkills || [];

                            return (
                                <article
                                    className="recommendation-job-card"
                                    key={job.jobId}
                                >

                                    {/* CARD TOP */}

                                    <div className="recommendation-card-top">

                                        <div className="recommendation-company">

                                            <div className="company-avatar">
                                                {job.company
                                                    ?.charAt(0)
                                                    .toUpperCase() || "C"}
                                            </div>

                                            <div>
                                                <h3>
                                                    {job.company}
                                                </h3>

                                                <span>
                                                    {job.department ||
                                                        "General"}
                                                </span>
                                            </div>

                                        </div>

                                        <div className="recommendation-rank">
                                            #{index + 1}
                                        </div>

                                    </div>

                                    {/* JOB TITLE */}

                                    <div className="recommendation-job-title">

                                        <span>
                                            RECOMMENDED ROLE
                                        </span>

                                        <h2>
                                            {job.jobTitle}
                                        </h2>

                                    </div>

                                    {/* MATCH AREA */}

                                    <div className="match-section">

                                        <div className="match-circle">

                                            <div>
                                                <strong>
                                                    {match}%
                                                </strong>

                                                <span>
                                                    Match
                                                </span>
                                            </div>

                                        </div>

                                        <div className="match-info">

                                            <div className="match-info-header">

                                                <div>
                                                    <span>
                                                        Skill Compatibility
                                                    </span>

                                                    <strong>
                                                        {match >= 85
                                                            ? "Excellent Match"
                                                            : match >= 70
                                                                ? "Strong Match"
                                                                : "Potential Match"}
                                                    </strong>
                                                </div>

                                                <b>
                                                    {match}%
                                                </b>

                                            </div>

                                            <div className="recommendation-progress">
                                                <div
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            Math.max(
                                                                0,
                                                                match
                                                            )
                                                        )}%`
                                                    }}
                                                ></div>
                                            </div>

                                            <p>
                                                {matchedSkills.length} of{" "}
                                                {requiredSkills.length} required
                                                skills matched.
                                            </p>

                                        </div>

                                    </div>

                                    {/* ELIGIBILITY */}

                                    <div className="eligibility-banner">

                                        <div className="eligibility-check">
                                            ✓
                                        </div>

                                        <div>
                                            <strong>
                                                Eligible for this role
                                            </strong>

                                            <span>
                                                Academic and eligibility
                                                requirements are satisfied.
                                            </span>
                                        </div>

                                    </div>

                                    {/* DETAILS */}

                                    <div className="recommendation-job-details">

                                        <div>
                                            <span>
                                                🎓 Minimum CGPA
                                            </span>

                                            <strong>
                                                {job.minimumCGPA ??
                                                    "N/A"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                📋 Max Arrears
                                            </span>

                                            <strong>
                                                {job.maximumArrears ??
                                                    "N/A"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                📅 Interview
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    job.interviewDate
                                                )}
                                            </strong>
                                        </div>

                                    </div>

                                    {/* SKILL STATUS */}

                                    <div className="skill-status-section">

                                        <div className="skill-status-column">

                                            <div className="skill-status-heading matched">
                                                <span>✓</span>
                                                Skills You Have
                                            </div>

                                            <div className="skill-chip-list">

                                                {matchedSkills.length > 0 ? (
                                                    matchedSkills.map(
                                                        (skill, skillIndex) => (
                                                            <span
                                                                key={skillIndex}
                                                                className="matched-chip"
                                                            >
                                                                {skill}
                                                            </span>
                                                        )
                                                    )
                                                ) : (
                                                    <span className="no-skills">
                                                        No matched skills
                                                    </span>
                                                )}

                                            </div>

                                        </div>

                                        <div className="skill-status-column">

                                            <div className="skill-status-heading missing">
                                                <span>!</span>
                                                Skills to Improve
                                            </div>

                                            <div className="skill-chip-list">

                                                {missingSkills.length > 0 ? (
                                                    missingSkills.map(
                                                        (skill, skillIndex) => (
                                                            <span
                                                                key={skillIndex}
                                                                className="missing-chip"
                                                            >
                                                                {skill}
                                                            </span>
                                                        )
                                                    )
                                                ) : (
                                                    <span className="no-skills">
                                                        All required skills matched
                                                    </span>
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                    {/* READINESS */}

                                    <div className="readiness-section">

                                        <div className="readiness-header">

                                            <div>
                                                <span>
                                                    PLACEMENT READINESS
                                                </span>

                                                <strong>
                                                    {readiness}%
                                                </strong>
                                            </div>

                                            <b
                                                className={`readiness-label ${getReadinessClass(
                                                    readiness
                                                )}`}
                                            >
                                                {getReadinessLabel(
                                                    readiness
                                                )}
                                            </b>

                                        </div>

                                        <div className="readiness-bar">
                                            <div
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        Math.max(
                                                            0,
                                                            readiness
                                                        )
                                                    )}%`
                                                }}
                                            ></div>
                                        </div>

                                    </div>

                                    {/* ACTIONS */}

                                    <div className="recommendation-actions">

                                        <button
                                            className="action-secondary"
                                            onClick={() =>
                                                handleSkillGap(job)
                                            }
                                        >
                                            🧠 Skill Gap
                                        </button>

                                        <button
                                            className="action-learning"
                                            onClick={() =>
                                                handleLearning(job)
                                            }
                                        >
                                            📚 Learning Plan
                                        </button>

                                        <button
                                            className="action-primary"
                                            onClick={() =>
                                                navigate(
                                                    `/jobs/${job.jobId}`
                                                )
                                            }
                                        >
                                            View Job →
                                        </button>

                                    </div>

                                </article>
                            );
                        })}

                    </section>

                )}

                {/* FOOTER */}

                <footer className="recommendation-footer">

                    <span>
                        🎓 CampusAI Placement Intelligence
                    </span>

                    <span>
                        Recommendations personalised for {student.name}
                    </span>

                </footer>

            </main>

        </div>
    );
}

export default Recommendations;