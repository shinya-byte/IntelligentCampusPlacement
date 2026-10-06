
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Learning.css";

function Learning() {
    const navigate = useNavigate();
    const location = useLocation();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedJobId, setSelectedJobId] = useState(
        location.state?.jobId || ""
    );

    /*
     * Progress is stored separately for every job.
     *
     * Example:
     * {
     *   "tcs-job-id": {
     *      "0-0": true,
     *      "0-1": true
     *   },
     *   "infosys-job-id": {
     *      "0-0": true
     *   }
     * }
     */
    const [jobProgress, setJobProgress] = useState(() => {
        try {
            const savedProgress =
                localStorage.getItem("campusAI_learningProgress");

            return savedProgress
                ? JSON.parse(savedProgress)
                : {};
        } catch (error) {
            console.error(
                "Unable to load learning progress:",
                error
            );

            return {};
        }
    });

    useEffect(() => {
        const studentId = localStorage.getItem("studentId");

        if (!studentId) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:5000/dashboard/${studentId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Failed to load learning data"
                    );
                }

                return response.json();
            })
            .then((data) => {
                setDashboard(data);

                const jobs = data.jobAnalysis || [];

                if (!selectedJobId && jobs.length > 0) {
                    setSelectedJobId(String(jobs[0].jobId));
                }

                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "Learning error:",
                    error
                );

                setLoading(false);
            });
    }, [navigate, selectedJobId]);

    /*
     * Save job-wise progress whenever it changes.
     */
    useEffect(() => {
        localStorage.setItem(
            "campusAI_learningProgress",
            JSON.stringify(jobProgress)
        );
    }, [jobProgress]);

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

    const getReadiness = (job) => {
        return Number(
            job?.readiness?.readinessScore || 0
        );
    };

    const getMatch = (job) => {
        return Number(
            job?.skillGap?.matchPercentage || 0
        );
    };

    const selectedJob = useMemo(() => {
        if (!dashboard?.jobAnalysis) {
            return null;
        }

        return (
            dashboard.jobAnalysis.find(
                (job) =>
                    String(job.jobId) ===
                    String(selectedJobId)
            ) ||
            dashboard.jobAnalysis[0]
        );
    }, [dashboard, selectedJobId]);

    /*
     * Create a different roadmap depending on
     * the missing skills of the selected job.
     */
    const roadmap = useMemo(() => {
        if (!selectedJob) {
            return [];
        }

        const missingSkills =
            selectedJob.skillGap?.missingSkills || [];

        const normalizedSkills = missingSkills.map(
            (skill) =>
                String(skill)
                    .trim()
                    .toLowerCase()
        );

        const hasReact = normalizedSkills.some(
            (skill) =>
                skill === "react" ||
                skill === "react.js"
        );

        const hasMongoDB = normalizedSkills.some(
            (skill) =>
                skill === "mongodb" ||
                skill === "mongo db"
        );

        const hasSQL = normalizedSkills.some(
            (skill) => skill === "sql"
        );

        const hasJava = normalizedSkills.some(
            (skill) => skill === "java"
        );

        const hasPython = normalizedSkills.some(
            (skill) => skill === "python"
        );

        const weeks = [];

        if (hasReact) {
            weeks.push({
                week: "Week 1",
                title: "React Fundamentals",
                duration: "5 Days",
                topics: [
                    "Components and JSX",
                    "Props and State",
                    "React Hooks",
                    "Forms and Events"
                ],
                task:
                    "Build a small React To-Do application."
            });

            weeks.push({
                week: "Week 2",
                title: "React Application Development",
                duration: "5 Days",
                topics: [
                    "React Router",
                    "API Integration",
                    "Fetching REST API data",
                    "Error and Loading States"
                ],
                task:
                    "Connect a React application with a REST API."
            });
        }

        if (hasMongoDB) {
            weeks.push({
                week:
                    weeks.length + 1 <= 4
                        ? `Week ${weeks.length + 1}`
                        : "Advanced Week",
                title: "MongoDB & Mongoose",
                duration: "5 Days",
                topics: [
                    "Collections and Documents",
                    "CRUD Operations",
                    "MongoDB Queries",
                    "Mongoose Schema and Models"
                ],
                task:
                    "Create a small student database using MongoDB."
            });
        }

        if (hasSQL) {
            weeks.push({
                week:
                    weeks.length + 1 <= 4
                        ? `Week ${weeks.length + 1}`
                        : "Advanced Week",
                title: "SQL & Database Practice",
                duration: "5 Days",
                topics: [
                    "SELECT and WHERE",
                    "JOIN Operations",
                    "GROUP BY and HAVING",
                    "Subqueries"
                ],
                task:
                    "Solve placement-style SQL problems."
            });
        }

        if (hasJava) {
            weeks.push({
                week:
                    weeks.length + 1 <= 4
                        ? `Week ${weeks.length + 1}`
                        : "Advanced Week",
                title: "Java Programming",
                duration: "5 Days",
                topics: [
                    "Java Basics",
                    "Object-Oriented Programming",
                    "Collections",
                    "Exception Handling"
                ],
                task:
                    "Build a small Java console application."
            });
        }

        if (hasPython) {
            weeks.push({
                week:
                    weeks.length + 1 <= 4
                        ? `Week ${weeks.length + 1}`
                        : "Advanced Week",
                title: "Python Programming",
                duration: "5 Days",
                topics: [
                    "Python Basics",
                    "Functions",
                    "Object-Oriented Programming",
                    "Data Structures"
                ],
                task:
                    "Create a small Python-based mini project."
            });
        }

        /*
         * If there are no missing skills, don't create
         * a fake technical-skill roadmap.
         *
         * Instead, move the student into placement preparation.
         */
        if (weeks.length === 0) {
            weeks.push({
                week: "Week 1",
                title: "Technical Revision",
                duration: "5 Days",
                topics: [
                    "Revise your required technical skills",
                    "Practice coding problems",
                    "Solve technical interview questions",
                    "Review your projects"
                ],
                task:
                    "Complete a technical mock test."
            });

            weeks.push({
                week: "Week 2",
                title: "Interview Preparation",
                duration: "5 Days",
                topics: [
                    "Technical interview questions",
                    "Project explanation",
                    "Problem solving",
                    "HR interview preparation"
                ],
                task:
                    "Complete a mock placement interview."
            });
        }

        /*
         * Final placement preparation stage.
         */
        if (weeks.length < 4) {
            weeks.push({
                week: `Week ${weeks.length + 1}`,
                title: "Placement Preparation",
                duration: "5 Days",
                topics: [
                    "Technical interview revision",
                    "Coding practice",
                    "Project explanation",
                    "Mock interview"
                ],
                task:
                    "Complete a full placement preparation test."
            });
        }

        return weeks.slice(0, 4);
    }, [selectedJob]);

    /*
     * Give every topic a unique ID.
     *
     * The same topic number in another job does NOT
     * share its completion state because the state is
     * stored under selectedJob.jobId.
     */
    const allTopics = roadmap.flatMap(
        (week, weekIndex) =>
            week.topics.map(
                (topic, topicIndex) => ({
                    id: `${weekIndex}-${topicIndex}`,
                    topic,
                    week: week.week,
                    weekIndex,
                    topicIndex
                })
            )
    );

    /*
     * Get progress ONLY for the currently selected job.
     */
    const currentJobProgress =
        selectedJob
            ? jobProgress[String(selectedJob.jobId)] || {}
            : {};

    const completedCount = allTopics.filter(
        (topic) =>
            currentJobProgress[topic.id] === true
    ).length;

    const progressPercentage =
        allTopics.length === 0
            ? 0
            : Math.round(
                (completedCount /
                    allTopics.length) *
                    100
            );

    /*
     * Toggle topic for ONLY the selected job.
     */
    const toggleTopic = (topicId) => {
        if (!selectedJob) {
            return;
        }

        const jobId = String(selectedJob.jobId);

        setJobProgress((previous) => {
            const existingJobProgress =
                previous[jobId] || {};

            return {
                ...previous,

                [jobId]: {
                    ...existingJobProgress,

                    [topicId]:
                        !existingJobProgress[topicId]
                }
            };
        });
    };

    const readiness = selectedJob
        ? getReadiness(selectedJob)
        : 0;

    const targetReadiness = Math.max(
        90,
        readiness
    );

    const estimatedWeeks = roadmap.length;

    if (loading) {
        return (
            <div className="learning-loading">

                <div className="learning-loader"></div>

                <h2>
                    Preparing your learning roadmap...
                </h2>

                <p>
                    CampusAI is creating a
                    job-specific learning path for you.
                </p>

            </div>
        );
    }

    if (!dashboard || !dashboard.student) {
        return (
            <div className="learning-error">

                <div className="learning-error-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to load learning roadmap
                </h2>

                <p>
                    Please make sure the backend
                    server is running.
                </p>

                <button
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Back to Dashboard
                </button>

            </div>
        );
    }

    const student = dashboard.student;
    const jobs = dashboard.jobAnalysis || [];

    return (
        <div className="learning-page">

            {/* SIDEBAR */}

            <aside className="learning-sidebar">

                <div className="learning-brand">

                    <div className="learning-brand-icon">
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

                <div className="learning-profile">

                    <div className="learning-avatar">
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

                <nav className="learning-nav">

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <span>📊</span>
                        Dashboard
                    </button>

                    <button
                        onClick={() =>
                            navigate("/jobs")
                        }
                    >
                        <span>💼</span>
                        Jobs
                    </button>

                    <button
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        <span>👤</span>
                        Profile
                    </button>

                    <button
                        onClick={() =>
                            navigate("/recommendations")
                        }
                    >
                        <span>🎯</span>
                        Recommendations
                    </button>

                    <button
                        onClick={() =>
                            navigate("/skill-gap")
                        }
                    >
                        <span>🧠</span>
                        Skill Gap
                    </button>

                    <button className="learning-active">
                        <span>📚</span>
                        Learning
                    </button>

                </nav>

                <div className="learning-sidebar-bottom">

                    <div className="learning-tip">

                        <div>
                            💡
                        </div>

                        <p>
                            Complete each job's
                            roadmap to improve your
                            placement readiness.
                        </p>

                    </div>

                    <button
                        className="learning-logout"
                        onClick={() => {
                            localStorage.removeItem(
                                "studentId"
                            );

                            localStorage.removeItem(
                                "studentName"
                            );

                            navigate("/login");
                        }}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>

            {/* MAIN */}

            <main className="learning-main">

                {/* HEADER */}

                <header className="learning-header">

                    <div>

                        <div className="learning-eyebrow">
                            ✦ PERSONALIZED LEARNING
                        </div>

                        <h1>
                            Your Learning
                            <span> Roadmap</span>
                        </h1>

                        <p>
                            Follow a structured learning
                            path designed for your selected
                            placement opportunity.
                        </p>

                    </div>

                    <div className="learning-header-icon">
                        📚
                    </div>

                </header>

                {/* JOB SELECTOR */}

                <section className="learning-job-selector">

                    <div>

                        <span className="selector-label">
                            LEARNING TARGET
                        </span>

                        <h2>
                            Choose a job to build
                            your roadmap
                        </h2>

                    </div>

                    <select
                        value={
                            selectedJob?.jobId || ""
                        }
                        onChange={(event) =>
                            setSelectedJobId(
                                event.target.value
                            )
                        }
                    >
                        {jobs.map((job) => (
                            <option
                                key={job.jobId}
                                value={job.jobId}
                            >
                                {job.company} -{" "}
                                {job.jobTitle}
                            </option>
                        ))}
                    </select>

                </section>

                {selectedJob && (
                    <>

                        {/* JOB TARGET */}

                        <section className="learning-target-card">

                            <div className="target-main">

                                <div className="target-company">
                                    {selectedJob.company
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <span>
                                        YOUR TARGET ROLE
                                    </span>

                                    <h2>
                                        {selectedJob.jobTitle}
                                    </h2>

                                    <p>
                                        {selectedJob.company}
                                        {" • "}
                                        {selectedJob.department}
                                    </p>

                                </div>

                            </div>

                            <div className="target-date">

                                <span>
                                    INTERVIEW
                                </span>

                                <strong>
                                    {formatDate(
                                        selectedJob.interviewDate
                                    )}
                                </strong>

                            </div>

                        </section>

                        {/* SUMMARY */}

                        <section className="learning-summary-grid">

                            <div className="learning-summary-card">

                                <div className="summary-icon purple">
                                    🎯
                                </div>

                                <div>

                                    <span>
                                        CURRENT READINESS
                                    </span>

                                    <strong>
                                        {readiness}%
                                    </strong>

                                </div>

                            </div>

                            <div className="learning-summary-card">

                                <div className="summary-icon blue">
                                    🧠
                                </div>

                                <div>

                                    <span>
                                        SKILL MATCH
                                    </span>

                                    <strong>
                                        {getMatch(
                                            selectedJob
                                        )}%
                                    </strong>

                                </div>

                            </div>

                            <div className="learning-summary-card">

                                <div className="summary-icon orange">
                                    🗓️
                                </div>

                                <div>

                                    <span>
                                        ESTIMATED PLAN
                                    </span>

                                    <strong>
                                        {estimatedWeeks}{" "}
                                        Weeks
                                    </strong>

                                </div>

                            </div>

                            <div className="learning-summary-card">

                                <div className="summary-icon green">
                                    🚀
                                </div>

                                <div>

                                    <span>
                                        TARGET READINESS
                                    </span>

                                    <strong>
                                        {targetReadiness}%
                                    </strong>

                                </div>

                            </div>

                        </section>

                        {/* PROGRESS */}

                        <section className="learning-progress-card">

                            <div className="progress-heading">

                                <div>

                                    <span>
                                        {selectedJob.company?.toUpperCase()}{" "}
                                        LEARNING PROGRESS
                                    </span>

                                    <h2>
                                        {progressPercentage}%
                                        {" "}Completed
                                    </h2>

                                </div>

                                <div className="progress-number">
                                    {completedCount}/
                                    {allTopics.length}
                                </div>

                            </div>

                            <div className="learning-progress-track">

                                <div
                                    className="learning-progress-fill"
                                    style={{
                                        width:
                                            `${progressPercentage}%`
                                    }}
                                ></div>

                            </div>

                            <p>
                                This progress belongs only
                                to{" "}
                                <strong>
                                    {selectedJob.company}
                                </strong>
                                {" "}
                                -{" "}
                                {selectedJob.jobTitle}.
                            </p>

                        </section>

                        {/* ROADMAP */}

                        <section className="roadmap-section">

                            <div className="section-heading">

                                <div>

                                    <span>
                                        STEP-BY-STEP PLAN
                                    </span>

                                    <h2>
                                        Your Placement Roadmap
                                    </h2>

                                    <p>
                                        Learn in the recommended
                                        order and complete the
                                        practical task at the end
                                        of each stage.
                                    </p>

                                </div>

                            </div>

                            <div className="roadmap">

                                {roadmap.map(
                                    (
                                        week,
                                        weekIndex
                                    ) => (

                                        <div
                                            className="roadmap-item"
                                            key={`${week.week}-${weekIndex}`}
                                        >

                                            <div className="roadmap-line">

                                                <div className="roadmap-number">
                                                    {weekIndex + 1}
                                                </div>

                                                {weekIndex <
                                                    roadmap.length -
                                                        1 && (
                                                    <div className="roadmap-connector"></div>
                                                )}

                                            </div>

                                            <article className="roadmap-card">

                                                <div className="roadmap-card-header">

                                                    <div>

                                                        <span className="roadmap-week">
                                                            {week.week}
                                                        </span>

                                                        <h3>
                                                            {week.title}
                                                        </h3>

                                                    </div>

                                                    <span className="roadmap-duration">
                                                        ⏱{" "}
                                                        {week.duration}
                                                    </span>

                                                </div>

                                                <div className="roadmap-topics">

                                                    {week.topics.map(
                                                        (
                                                            topic,
                                                            topicIndex
                                                        ) => {

                                                            const topicId =
                                                                `${weekIndex}-${topicIndex}`;

                                                            const completed =
                                                                currentJobProgress[
                                                                    topicId
                                                                ] === true;

                                                            return (
                                                                <button
                                                                    className={`roadmap-topic ${
                                                                        completed
                                                                            ? "topic-completed"
                                                                            : ""
                                                                    }`}
                                                                    key={
                                                                        topicId
                                                                    }
                                                                    onClick={() =>
                                                                        toggleTopic(
                                                                            topicId
                                                                        )
                                                                    }
                                                                >

                                                                    <span className="topic-check">
                                                                        {completed
                                                                            ? "✓"
                                                                            : "○"}
                                                                    </span>

                                                                    <span>
                                                                        {
                                                                            topic
                                                                        }
                                                                    </span>

                                                                </button>
                                                            );
                                                        }
                                                    )}

                                                </div>

                                                <div className="roadmap-task">

                                                    <span>
                                                        🛠 PRACTICAL TASK
                                                    </span>

                                                    <p>
                                                        {week.task}
                                                    </p>

                                                </div>

                                            </article>

                                        </div>
                                    )
                                )}

                            </div>

                        </section>

                        {/* TODAY */}

                        <section className="today-learning">

                            <div className="today-icon">
                                🚀
                            </div>

                            <div className="today-content">

                                <span>
                                    TODAY'S LEARNING
                                </span>

                                <h2>
                                    Start with your first
                                    roadmap topic
                                </h2>

                                <p>
                                    Complete the topics from
                                    Week 1 and move forward
                                    step by step.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    document
                                        .querySelector(
                                            ".roadmap-section"
                                        )
                                        ?.scrollIntoView({
                                            behavior:
                                                "smooth"
                                        })
                                }
                            >
                                Start Learning →
                            </button>

                        </section>

                        {/* READINESS */}

                        <section className="readiness-roadmap-card">

                            <div>

                                <span>
                                    PLACEMENT READINESS
                                </span>

                                <h2>
                                    From learning to placement
                                </h2>

                                <p>
                                    Your current readiness is{" "}
                                    <strong>
                                        {readiness}%
                                    </strong>
                                    . Keep completing the
                                    roadmap to strengthen
                                    your preparation for{" "}
                                    <strong>
                                        {
                                            selectedJob.jobTitle
                                        }
                                    </strong>
                                    .
                                </p>

                            </div>

                            <div className="readiness-visual">

                                <div
                                    className="readiness-circle"
                                    style={{
                                        "--readiness":
                                            `${readiness}%`
                                    }}
                                >

                                    <strong>
                                        {readiness}%
                                    </strong>

                                    <span>
                                        Ready
                                    </span>

                                </div>

                            </div>

                        </section>

                        {/* ACTIONS */}

                        <section className="learning-actions">

                            <button
                                className="secondary-learning-button"
                                onClick={() =>
                                    navigate(
                                        "/skill-gap",
                                        {
                                            state: {
                                                jobId:
                                                    selectedJob.jobId,
                                                company:
                                                    selectedJob.company,
                                                jobTitle:
                                                    selectedJob.jobTitle
                                            }
                                        }
                                    )
                                }
                            >
                                ← View Skill Gap
                            </button>

                            <button
                                className="primary-learning-button"
                                onClick={() =>
                                    navigate("/jobs")
                                }
                            >
                                Explore Jobs →
                            </button>

                        </section>

                    </>
                )}

                <footer className="learning-footer">

                    <span>
                        🎓 CampusAI Placement Intelligence
                    </span>

                    <span>
                        Personalized learning for{" "}
                        {student.name}
                    </span>

                </footer>

            </main>

        </div>
    );
}

export default Learning;
