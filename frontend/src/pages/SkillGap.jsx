
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SkillGap.css";

function SkillGap() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const studentId = localStorage.getItem("studentId");

        if (!studentId) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:5000/dashboard/${studentId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load skill gap");
                }

                return response.json();
            })
            .then((data) => {
                setDashboard(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Skill Gap Error:", error);
                setLoading(false);
            });
    }, [navigate]);

    const getSkillName = (skill) => {
        if (typeof skill === "object" && skill !== null) {
            return skill.skill || skill.name || "Skill";
        }

        return String(skill || "");
    };

    const getMatchColorClass = (percentage) => {
        if (percentage >= 75) {
            return "high";
        }

        if (percentage >= 50) {
            return "medium";
        }

        return "low";
    };

    const getEligibilityClass = (eligible) => {
        return eligible ? "eligible" : "not-eligible";
    };

    const getEligibilityText = (job) => {
        if (job.eligibility?.eligibilityLevel) {
            return job.eligibility.eligibilityLevel;
        }

        return job.eligibility?.eligible
            ? "Eligible"
            : "Not Eligible";
    };

    if (loading) {
        return (
            <div className="skillgap-loading-page">
                <div className="skillgap-loading-spinner"></div>

                <h2>Analysing Your Skills...</h2>

                <p>
                    CampusAI is comparing your skills with
                    placement requirements.
                </p>
            </div>
        );
    }

    if (!dashboard || !dashboard.student) {
        return (
            <div className="skillgap-page">
                <div className="skillgap-error">
                    <div className="skillgap-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to Load Skill Gap
                    </h2>

                    <p>
                        Please make sure your backend server
                        is running and try again.
                    </p>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const student = dashboard.student;

    const analyses = Array.isArray(dashboard.jobAnalysis)
        ? dashboard.jobAnalysis
        : [];

    const sortedJobs = [...analyses].sort(
        (a, b) =>
            (b.skillGap?.matchPercentage || 0) -
            (a.skillGap?.matchPercentage || 0)
    );

    const totalJobs = sortedJobs.length;

    const strongMatches = sortedJobs.filter(
        (job) =>
            (job.skillGap?.matchPercentage || 0) >= 75
    ).length;

    const improvementJobs = sortedJobs.filter(
        (job) =>
            (job.skillGap?.missingSkills?.length || 0) > 0
    ).length;

    return (
        <div className="skillgap-page">

            {/* TOP NAVIGATION */}

            <header className="skillgap-navbar">

                <div
                    className="skillgap-brand"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    <div className="skillgap-brand-logo">
                        ✦
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
                    className="skillgap-back-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </header>


            {/* MAIN CONTENT */}

            <main className="skillgap-main">

                {/* HERO */}

                <section className="skillgap-hero">

                    <div className="skillgap-hero-content">

                        <div className="skillgap-eyebrow">
                            <span>AI SKILL ANALYSIS</span>
                        </div>

                        <h1>
                            Understand Your
                            <br />
                            <strong>Skill Gap</strong>
                        </h1>

                        <p>
                            Hi {student.name}! CampusAI compares
                            your current skills with every job
                            requirement and shows exactly where
                            you need improvement.
                        </p>

                        <div className="skillgap-hero-actions">

                            <button
                                onClick={() =>
                                    navigate("/jobs")
                                }
                                className="skillgap-primary-button"
                            >
                                Explore Jobs →
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/profile")
                                }
                                className="skillgap-secondary-button"
                            >
                                Update My Skills
                            </button>

                        </div>

                    </div>

                    <div className="skillgap-hero-visual">

                        <div className="skillgap-orbit orbit-one"></div>
                        <div className="skillgap-orbit orbit-two"></div>

                        <div className="skillgap-ai-circle">

                            <div className="skillgap-ai-icon">
                                🧠
                            </div>

                            <span>
                                AI
                            </span>

                            <small>
                                ANALYSIS
                            </small>

                        </div>

                    </div>

                </section>


                {/* SUMMARY */}

                <section className="skillgap-summary">

                    <div className="skillgap-summary-card">

                        <div className="summary-icon purple">
                            💼
                        </div>

                        <div>
                            <span>
                                JOBS ANALYSED
                            </span>

                            <strong>
                                {totalJobs}
                            </strong>
                        </div>

                    </div>


                    <div className="skillgap-summary-card">

                        <div className="summary-icon green">
                            ✓
                        </div>

                        <div>
                            <span>
                                STRONG MATCHES
                            </span>

                            <strong>
                                {strongMatches}
                            </strong>
                        </div>

                    </div>


                    <div className="skillgap-summary-card">

                        <div className="summary-icon orange">
                            ⚡
                        </div>

                        <div>
                            <span>
                                NEED IMPROVEMENT
                            </span>

                            <strong>
                                {improvementJobs}
                            </strong>
                        </div>

                    </div>


                    <div className="skillgap-summary-card">

                        <div className="summary-icon blue">
                            🎯
                        </div>

                        <div>
                            <span>
                                YOUR SKILLS
                            </span>

                            <strong>
                                {student.skills?.length || 0}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* CURRENT SKILLS */}

                <section className="skillgap-current-section">

                    <div className="skillgap-section-heading">

                        <div>
                            <span>
                                YOUR PROFILE
                            </span>

                            <h2>
                                Current Skills
                            </h2>

                            <p>
                                These are the skills CampusAI is
                                using for job matching.
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/profile")
                            }
                        >
                            Edit Profile →
                        </button>

                    </div>


                    <div className="skillgap-current-skills">

                        {student.skills &&
                        student.skills.length > 0 ? (

                            student.skills.map(
                                (skill, index) => (
                                    <div
                                        className="current-skill"
                                        key={index}
                                    >
                                        <span>
                                            ✓
                                        </span>

                                        {getSkillName(skill)}
                                    </div>
                                )
                            )

                        ) : (

                            <div className="no-skills">
                                No skills added yet.
                            </div>

                        )}

                    </div>

                </section>


                {/* JOB ANALYSIS */}

                <section className="skillgap-analysis-section">

                    <div className="skillgap-section-heading analysis-heading">

                        <div>

                            <span>
                                JOB-WISE INTELLIGENCE
                            </span>

                            <h2>
                                Your Skill Gap by Job
                            </h2>

                            <p>
                                Each card shows only the skills
                                required for that specific job.
                            </p>

                        </div>

                    </div>


                    {sortedJobs.length === 0 ? (

                        <div className="skillgap-no-jobs">

                            <div>
                                🔍
                            </div>

                            <h2>
                                No Jobs Available
                            </h2>

                            <p>
                                There are no job requirements
                                available for analysis yet.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/jobs")
                                }
                            >
                                View Jobs
                            </button>

                        </div>

                    ) : (

                        <div className="skillgap-job-list">

                            {sortedJobs.map(
                                (job, index) => {

                                    const matchPercentage =
                                        job.skillGap
                                            ?.matchPercentage || 0;

                                    const matchedSkills =
                                        job.skillGap
                                            ?.matchedSkills || [];

                                    const missingSkills =
                                        job.skillGap
                                            ?.missingSkills || [];

                                    const matchClass =
                                        getMatchColorClass(
                                            matchPercentage
                                        );

                                    const eligibilityClass =
                                        getEligibilityClass(
                                            job.eligibility?.eligible
                                        );

                                    return (

                                        <article
                                            className={`skillgap-job-card ${matchClass}`}
                                            key={
                                                job.jobId ||
                                                index
                                            }
                                        >

                                            {/* JOB TOP */}

                                            <div className="skillgap-job-top">

                                                <div className="skillgap-company">

                                                    <div className="company-logo">
                                                        {job.company
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                            "C"}
                                                    </div>

                                                    <div>

                                                        <span>
                                                            {job.company}
                                                        </span>

                                                        <h3>
                                                            {job.jobTitle}
                                                        </h3>

                                                        <p>
                                                            {job.department ||
                                                                "Placement Opportunity"}
                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="skillgap-match-circle">

                                                    <svg
                                                        viewBox="0 0 100 100"
                                                    >
                                                        <circle
                                                            cx="50"
                                                            cy="50"
                                                            r="42"
                                                            className="circle-bg"
                                                        />

                                                        <circle
                                                            cx="50"
                                                            cy="50"
                                                            r="42"
                                                            className="circle-progress"
                                                            style={{
                                                                strokeDasharray: `${matchPercentage * 2.64} 264`
                                                            }}
                                                        />
                                                    </svg>

                                                    <div className="circle-value">

                                                        <strong>
                                                            {matchPercentage}%
                                                        </strong>

                                                        <span>
                                                            MATCH
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* MATCH STATUS */}

                                            <div className="skillgap-status-row">

                                                <div
                                                    className={`skillgap-status ${eligibilityClass}`}
                                                >

                                                    <span>
                                                        {job.eligibility?.eligible
                                                            ? "✓"
                                                            : "!"}
                                                    </span>

                                                    <div>

                                                        <strong>
                                                            {
                                                                getEligibilityText(
                                                                    job
                                                                )
                                                            }
                                                        </strong>

                                                        <small>
                                                            Placement
                                                            eligibility
                                                        </small>

                                                    </div>

                                                </div>


                                                <div className="skillgap-interview">

                                                    <span>
                                                        INTERVIEW
                                                    </span>

                                                    <strong>
                                                        {job.interviewDate
                                                            ? new Date(
                                                                job.interviewDate
                                                            ).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }
                                                            )
                                                            : "Not scheduled"}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* PROGRESS */}

                                            <div className="skillgap-progress-section">

                                                <div className="progress-label">

                                                    <span>
                                                        Skill Requirement Match
                                                    </span>

                                                    <strong>
                                                        {matchedSkills.length}
                                                        /
                                                        {
                                                            job.requiredSkills
                                                                ?.length || 0
                                                        } skills
                                                    </strong>

                                                </div>

                                                <div className="progress-track">

                                                    <div
                                                        className="progress-value"
                                                        style={{
                                                            width: `${matchPercentage}%`
                                                        }}
                                                    ></div>

                                                </div>

                                            </div>


                                            {/* SKILL COMPARISON */}

                                            <div className="skillgap-comparison">

                                                <div className="skill-column matched-column">

                                                    <div className="column-title">

                                                        <div>
                                                            ✓
                                                        </div>

                                                        <span>
                                                            You Have
                                                        </span>

                                                        <strong>
                                                            {
                                                                matchedSkills.length
                                                            }
                                                        </strong>

                                                    </div>


                                                    <div className="skill-tags">

                                                        {matchedSkills.length >
                                                        0 ? (

                                                            matchedSkills.map(
                                                                (
                                                                    skill,
                                                                    skillIndex
                                                                ) => (
                                                                    <span
                                                                        className="matched-tag"
                                                                        key={
                                                                            skillIndex
                                                                        }
                                                                    >
                                                                        ✓{" "}
                                                                        {getSkillName(
                                                                            skill
                                                                        )}
                                                                    </span>
                                                                )
                                                            )

                                                        ) : (

                                                            <p className="skill-column-empty">
                                                                No matching
                                                                skills yet
                                                            </p>

                                                        )}

                                                    </div>

                                                </div>


                                                <div className="skill-column missing-column">

                                                    <div className="column-title">

                                                        <div>
                                                            +
                                                        </div>

                                                        <span>
                                                            Need to Learn
                                                        </span>

                                                        <strong>
                                                            {
                                                                missingSkills.length
                                                            }
                                                        </strong>

                                                    </div>


                                                    <div className="skill-tags">

                                                        {missingSkills.length >
                                                        0 ? (

                                                            missingSkills.map(
                                                                (
                                                                    skill,
                                                                    skillIndex
                                                                ) => (
                                                                    <span
                                                                        className="missing-tag"
                                                                        key={
                                                                            skillIndex
                                                                        }
                                                                    >
                                                                        +{" "}
                                                                        {getSkillName(
                                                                            skill
                                                                        )}
                                                                    </span>
                                                                )
                                                            )

                                                        ) : (

                                                            <p className="skill-column-empty">
                                                                🎉 No missing
                                                                skills
                                                            </p>

                                                        )}

                                                    </div>

                                                </div>

                                            </div>


                                            {/* REASON */}

                                            {job.eligibility?.reasons &&
                                                job.eligibility.reasons
                                                    .length > 0 && (

                                                    <div className="skillgap-reason">

                                                        <span>
                                                            💡
                                                        </span>

                                                        <div>

                                                            <strong>
                                                                Why you need
                                                                improvement
                                                            </strong>

                                                            <p>
                                                                {
                                                                    job.eligibility
                                                                        .reasons[0]
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                )}


                                            {/* FOOTER */}

                                            <div className="skillgap-job-footer">

                                                <div className="job-requirements">

                                                    <span>
                                                        Minimum CGPA:{" "}
                                                        <strong>
                                                            {
                                                                job.minimumCGPA ??
                                                                "N/A"
                                                            }
                                                        </strong>
                                                    </span>

                                                    <span>
                                                        Max Arrears:{" "}
                                                        <strong>
                                                            {
                                                                job.maximumArrears ??
                                                                "N/A"
                                                            }
                                                        </strong>
                                                    </span>

                                                </div>


                                                {missingSkills.length >
                                                0 ? (

                                                    <button
                                                        className="learn-button"
                                                        onClick={() =>
                                                            navigate(
                                                                "/learning",
                                                                {
                                                                    state: {
                                                                        jobId:
                                                                            job.jobId,
                                                                        company:
                                                                            job.company,
                                                                        jobTitle:
                                                                            job.jobTitle,
                                                                        missingSkills:
                                                                            missingSkills
                                                                    }
                                                                }
                                                            )
                                                        }
                                                    >
                                                        📚 Learn Missing
                                                        Skills →
                                                    </button>

                                                ) : (

                                                    <button
                                                        className="ready-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/jobs/${job.jobId}`
                                                            )
                                                        }
                                                    >
                                                        ✓ View Job →
                                                    </button>

                                                )}

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </div>

                    )}

                </section>


                {/* FINAL CTA */}

                <section className="skillgap-final-cta">

                    <div className="cta-icon">
                        🚀
                    </div>

                    <div className="cta-content">

                        <span>
                            NEXT STEP
                        </span>

                        <h2>
                            Turn Your Skill Gaps Into Strengths
                        </h2>

                        <p>
                            Select a job, learn its missing skills,
                            update your profile, and let CampusAI
                            recalculate your placement readiness.
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate("/learning")
                        }
                    >
                        View Learning Plan →
                    </button>

                </section>

            </main>

        </div>
    );
}

export default SkillGap;
