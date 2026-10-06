import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./JobDetails.css";

function JobDetails() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:5000/jobs/${jobId}`
                );

                if (!response.ok) {
                    throw new Error("Unable to load job details");
                }

                const data = await response.json();
                setJob(data);
            } catch (err) {
                console.error(err);
                setError("Unable to load job details.");
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            fetchJob();
        }
    }, [jobId]);

    const formatDate = (date) => {
        if (!date) return "Not specified";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="job-details-loading">
                <div className="loading-spinner"></div>
                <p>Loading job details...</p>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="job-details-page">
                <div className="job-details-error">
                    <div className="error-icon">!</div>

                    <h2>Job Details Not Available</h2>

                    <p>
                        We could not load this job. Please go back and
                        try again.
                    </p>

                    <button
                        className="error-back-btn"
                        onClick={() => navigate("/jobs")}
                    >
                        ← Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    const companyName = job.company || "Company";
    const jobTitle = job.jobTitle || "Job Position";

    return (
        <div className="job-details-page">

            {/* TOP NAVIGATION */}
            <header className="job-details-navbar">

                <div className="job-details-brand">

                    <div className="brand-logo">
                        C
                    </div>

                    <div>
                        <h2>CampusAI</h2>
                        <span>Placement Intelligence</span>
                    </div>

                </div>

                <button
                    className="back-jobs-btn"
                    onClick={() => navigate("/jobs")}
                >
                    ← Back to Jobs
                </button>

            </header>

            <main className="job-details-container">

                {/* BREADCRUMB */}
                <div className="job-breadcrumb">
                    Jobs <span>›</span> {companyName} <span>›</span>{" "}
                    {jobTitle}
                </div>

                {/* HERO */}
                <section className="job-details-hero">

                    <div className="hero-left">

                        <div className="company-avatar">
                            {companyName.charAt(0).toUpperCase()}
                        </div>

                        <div className="hero-text">

                            <div className="company-name">
                                {companyName}
                            </div>

                            <h1>{jobTitle}</h1>

                            <div className="hero-meta">

                                {job.department && (
                                    <span>
                                        💼 {job.department}
                                    </span>
                                )}

                                <span>
                                    📅 Interview:{" "}
                                    {formatDate(job.interviewDate)}
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="open-status">
                        <span className="status-dot"></span>
                        Open Position
                    </div>

                </section>

                {/* QUICK STATS */}
                <section className="quick-stats">

                    <div className="stat-card">
                        <div className="stat-icon cgpa-icon">
                            🎓
                        </div>

                        <div>
                            <span>Minimum CGPA</span>
                            <strong>
                                {job.minimumCGPA ?? "N/A"}
                            </strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon arrears-icon">
                            📋
                        </div>

                        <div>
                            <span>Maximum Arrears</span>
                            <strong>
                                {job.maximumArrears ?? "N/A"}
                            </strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon date-icon">
                            📅
                        </div>

                        <div>
                            <span>Interview Date</span>
                            <strong>
                                {formatDate(job.interviewDate)}
                            </strong>
                        </div>
                    </div>

                </section>

                {/* MAIN GRID */}
                <section className="details-grid">

                    {/* LEFT */}
                    <div className="details-left">

                        <div className="details-card">

                            <div className="section-heading">
                                <div className="heading-icon">
                                    ✦
                                </div>

                                <div>
                                    <h2>Required Skills</h2>
                                    <p>
                                        Skills expected for this position
                                    </p>
                                </div>
                            </div>

                            {job.requiredSkills &&
                            job.requiredSkills.length > 0 ? (

                                <div className="skills-container">

                                    {job.requiredSkills.map(
                                        (skill, index) => (
                                            <span
                                                className="skill-pill"
                                                key={index}
                                            >
                                                ✓ {skill}
                                            </span>
                                        )
                                    )}

                                </div>

                            ) : (
                                <p className="empty-text">
                                    No specific skills listed.
                                </p>
                            )}

                        </div>

                        <div className="details-card">

                            <div className="section-heading">
                                <div className="heading-icon">
                                    ℹ
                                </div>

                                <div>
                                    <h2>Job Overview</h2>
                                    <p>
                                        Important information about this
                                        opportunity
                                    </p>
                                </div>
                            </div>

                            <div className="overview-list">

                                <div className="overview-row">
                                    <span>Company</span>
                                    <strong>{companyName}</strong>
                                </div>

                                <div className="overview-row">
                                    <span>Job Role</span>
                                    <strong>{jobTitle}</strong>
                                </div>

                                <div className="overview-row">
                                    <span>Department</span>
                                    <strong>
                                        {job.department || "N/A"}
                                    </strong>
                                </div>

                                <div className="overview-row">
                                    <span>Minimum CGPA</span>
                                    <strong>
                                        {job.minimumCGPA ?? "N/A"}
                                    </strong>
                                </div>

                                <div className="overview-row">
                                    <span>Maximum Arrears</span>
                                    <strong>
                                        {job.maximumArrears ?? "N/A"}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <aside className="details-right">

                        <div className="apply-card">

                            <div className="apply-icon">
                                🚀
                            </div>

                            <h2>Ready to Apply?</h2>

                            <p>
                                Check your eligibility and prepare for
                                this placement opportunity.
                            </p>

                            <button className="apply-button">
                                Apply for this Job
                            </button>

                            <div className="apply-note">
                                ✓ Your profile will be checked for
                                eligibility
                            </div>

                        </div>

                        <div className="info-card">

                            <h3>Placement Tip</h3>

                            <p>
                                Make sure your profile contains all the
                                required skills before applying.
                            </p>

                        </div>

                    </aside>

                </section>

            </main>
        </div>
    );
}

export default JobDetails;