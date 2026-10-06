import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/jobs")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to load jobs");
                }

                return response.json();
            })
            .then((data) => {
                setJobs(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Jobs error:", error);
                setJobs([]);
                setLoading(false);
            });
    }, []);

    const filteredJobs = jobs.filter((job) =>
        `${job.company || ""} ${job.jobTitle || ""} ${
            job.department || ""
        }`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const formatDate = (date) => {
        if (!date) return "Not specified";

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

    return (
        <div className="jobs-page">

            {/* ================= TOP BAR ================= */}

            <header className="jobs-topbar">

                <div className="jobs-brand">

                    <div className="jobs-brand-icon">
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


                <button
                    className="jobs-dashboard-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </header>


            {/* ================= MAIN ================= */}

            <main className="jobs-container">

                {/* HEADER */}

                <section className="jobs-heading">

                    <div>

                        <span className="jobs-label">
                            CAREER OPPORTUNITIES
                        </span>

                        <h1>
                            Explore Job Opportunities 💼
                        </h1>

                        <p>
                            Discover placement opportunities and find
                            roles that match your skills and academic profile.
                        </p>

                    </div>


                    <div className="jobs-count-card">

                        <span>
                            AVAILABLE JOBS
                        </span>

                        <strong>
                            {jobs.length}
                        </strong>

                    </div>

                </section>


                {/* ================= SEARCH ================= */}

                <section className="jobs-search-card">

                    <div className="search-icon">
                        🔍
                    </div>

                    <div className="search-content">

                        <label>
                            Search Opportunities
                        </label>

                        <input
                            type="text"
                            placeholder="Search by company, job title or department..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </section>


                {/* ================= RESULT INFO ================= */}

                {!loading && (
                    <div className="jobs-result-info">

                        <span>
                            Showing{" "}
                            <strong>
                                {filteredJobs.length}
                            </strong>{" "}
                            {filteredJobs.length === 1
                                ? "opportunity"
                                : "opportunities"}
                        </span>

                        {search && (
                            <button
                                onClick={() => setSearch("")}
                            >
                                Clear Search ×
                            </button>
                        )}

                    </div>
                )}


                {/* ================= LOADING ================= */}

                {loading ? (

                    <div className="jobs-loading">

                        <div className="jobs-loader"></div>

                        <h3>
                            Loading opportunities...
                        </h3>

                        <p>
                            Fetching the latest placement jobs.
                        </p>

                    </div>

                ) : filteredJobs.length === 0 ? (

                    /* ================= EMPTY ================= */

                    <div className="jobs-empty">

                        <div className="empty-job-icon">
                            🔍
                        </div>

                        <h2>
                            No opportunities found
                        </h2>

                        <p>
                            Try searching with another company,
                            job title or department.
                        </p>

                        {search && (
                            <button
                                onClick={() => setSearch("")}
                            >
                                Show All Jobs
                            </button>
                        )}

                    </div>

                ) : (

                    /* ================= JOB GRID ================= */

                    <div className="jobs-list">

                        {filteredJobs.map((job, index) => (

                            <article
                                className="job-opportunity-card"
                                key={job._id || index}
                            >

                                {/* TOP */}

                                <div className="job-card-top">

                                    <div className="company-avatar">
                                        {job.company
                                            ?.charAt(0)
                                            .toUpperCase() || "C"}
                                    </div>


                                    <div className="company-info">

                                        <h3>
                                            {job.company ||
                                                "Company"}
                                        </h3>

                                        <span>
                                            {job.department ||
                                                "General"}
                                        </span>

                                    </div>


                                    <div className="job-badge">
                                        OPEN
                                    </div>

                                </div>


                                {/* TITLE */}

                                <div className="job-card-title">

                                    <h2>
                                        {job.jobTitle ||
                                            "Job Opportunity"}
                                    </h2>

                                    <p>
                                        Placement Opportunity
                                    </p>

                                </div>


                                {/* DETAILS */}

                                <div className="job-info-grid">

                                    <div className="job-info-item">

                                        <span>
                                            🎯
                                        </span>

                                        <div>
                                            <small>
                                                Minimum CGPA
                                            </small>

                                            <strong>
                                                {job.minimumCGPA ??
                                                    "N/A"}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="job-info-item">

                                        <span>
                                            📋
                                        </span>

                                        <div>
                                            <small>
                                                Maximum Arrears
                                            </small>

                                            <strong>
                                                {job.maximumArrears ??
                                                    0}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="job-info-item">

                                        <span>
                                            📅
                                        </span>

                                        <div>
                                            <small>
                                                Interview Date
                                            </small>

                                            <strong>
                                                {formatDate(
                                                    job.interviewDate
                                                )}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="job-info-item">

                                        <span>
                                            💼
                                        </span>

                                        <div>
                                            <small>
                                                Department
                                            </small>

                                            <strong>
                                                {job.department ||
                                                    "N/A"}
                                            </strong>
                                        </div>

                                    </div>

                                </div>


                                {/* SKILLS */}

                                <div className="required-skills">

                                    <div className="skills-title">
                                        Required Skills
                                    </div>

                                    <div className="job-skill-list">

                                        {job.requiredSkills?.length >
                                        0 ? (

                                            job.requiredSkills.map(
                                                (
                                                    skill,
                                                    skillIndex
                                                ) => (

                                                    <span
                                                        key={
                                                            skillIndex
                                                        }
                                                    >
                                                        {skill}
                                                    </span>

                                                )
                                            )

                                        ) : (

                                            <span>
                                                No specific skills
                                            </span>

                                        )}

                                    </div>

                                </div>


                                {/* FOOTER */}

                                <div className="job-card-footer">

                                    <div>

                                        <span>
                                            Placement Role
                                        </span>

                                        <strong>
                                            {job.jobTitle}
                                        </strong>

                                    </div>


                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/jobs/${job._id}`
                                            )
                                        }
                                    >
                                        View Details
                                        <span> →</span>
                                    </button>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default Jobs;