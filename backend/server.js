
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Student = require("./models/Student");
const Company = require("./models/Company");
const Job = require("./models/Job");

const { checkEligibility } = require("./services/eligibilityService");
const { getSkillGap } = require("./services/skillGapService");
const { getRecommendations } = require("./services/recommendationService");
const { getLearningRecommendations } = require("./services/learningRecommendationService");
const { calculatePlacementReadiness } = require("./services/placementReadinessService");

const dashboardService = require("./services/dashboardService");

const getDashboard =
    typeof dashboardService === "function"
        ? dashboardService
        : dashboardService.getDashboard;

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.send("Intelligent Campus Placement System Backend Running");
});


// ===============================
// REGISTER
// ===============================

app.post("/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            department,
            cgpa,
            skills,
            projects,
            certifications,
            arrears
        } = req.body;

        const cleanEmail = (email || "").trim().toLowerCase();

        if (!name || !cleanEmail || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingStudent = await Student.findOne({
            email: cleanEmail
        });

        if (existingStudent) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({
            name,
            email: cleanEmail,
            password: hashedPassword,
            department,
            cgpa,
            skills: skills || [],
            projects: projects || [],
            certifications: certifications || [],
            arrears: arrears || 0
        });

        const savedStudent = await student.save();

        res.status(201).json({
            message: "Registration successful",
            studentId: savedStudent._id,
            name: savedStudent.name
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});


// ===============================
// LOGIN
// ===============================

app.post("/login", async (req, res) => {
    try {
        const email = (req.body.email || "")
            .trim()
            .toLowerCase();

        const password = req.body.password || "";

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const student = await Student.findOne({
            email: email
        });

        if (!student || !student.password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            student.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            studentId: student._id,
            name: student.name
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed"
        });
    }
});


// ===============================
// STUDENTS
// ===============================

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


app.get("/students/:studentId", async (req, res) => {
    try {
        const student = await Student.findById(
            req.params.studentId
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


app.post("/students", async (req, res) => {
    try {
        const student = new Student(req.body);

        const savedStudent = await student.save();

        res.status(201).json(savedStudent);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


app.put("/students/:studentId", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.studentId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// ===============================
// COMPANIES
// ===============================

app.get("/companies", async (req, res) => {
    try {
        const companies = await Company.find();

        res.json(companies);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


app.post("/companies", async (req, res) => {
    try {
        const company = new Company(req.body);

        const savedCompany = await company.save();

        res.status(201).json(savedCompany);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// ===============================
// JOBS
// ===============================

app.get("/jobs", async (req, res) => {
    try {
        const jobs = await Job.find();

        res.json(jobs);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


app.post("/jobs", async (req, res) => {
    try {
        const job = new Job(req.body);

        const savedJob = await job.save();

        res.status(201).json(savedJob);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


app.post("/jobs/bulk", async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({
                message: "Request body must be an array of jobs"
            });
        }

        const jobs = await Job.insertMany(req.body);

        res.status(201).json({
            message: `${jobs.length} jobs added successfully`,
            jobs
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


app.get("/jobs/:jobId", async (req, res) => {
    try {
        const job = await Job.findById(
            req.params.jobId
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(job);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


app.put("/jobs/:jobId", async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.jobId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(job);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


app.delete("/jobs/:jobId", async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(
            req.params.jobId
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// ===============================
// ELIGIBILITY
// ===============================

app.get(
    "/eligibility/:studentId/:jobId",
    async (req, res) => {
        try {
            const student = await Student.findById(
                req.params.studentId
            );

            const job = await Job.findById(
                req.params.jobId
            );

            if (!student || !job) {
                return res.status(404).json({
                    message: "Student or job not found"
                });
            }

            const result = checkEligibility(
                student,
                job
            );

            res.json(result);

        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);


// ===============================
// SKILL GAP
// ===============================

app.get(
    "/skill-gap/:studentId/:jobId",
    async (req, res) => {
        try {
            const student = await Student.findById(
                req.params.studentId
            );

            const job = await Job.findById(
                req.params.jobId
            );

            if (!student || !job) {
                return res.status(404).json({
                    message: "Student or job not found"
                });
            }

            const result = getSkillGap(
                student,
                job
            );

            res.json(result);

        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);


// ===============================
// JOB RECOMMENDATIONS
// ===============================

app.get(
    "/recommendations/:studentId",
    async (req, res) => {
        try {
            const student = await Student.findById(
                req.params.studentId
            );

            const jobs = await Job.find();

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            const result = [];

            for (const job of jobs) {
                const eligibility =
                    checkEligibility(
                        student,
                        job
                    );

                if (!eligibility.eligible) {
                    continue;
                }

                const skillGap =
                    getSkillGap(
                        student,
                        job
                    );

                result.push({
                    jobId: job._id,
                    company: job.company,
                    jobTitle: job.jobTitle,
                    department: job.department,
                    matchPercentage:
                        skillGap.matchPercentage,
                    matchedSkills:
                        skillGap.matchedSkills,
                    missingSkills:
                        skillGap.missingSkills
                });
            }

            result.sort(
                (a, b) =>
                    b.matchPercentage -
                    a.matchPercentage
            );

            res.json(result);

        } catch (error) {
            console.error(
                "Recommendation error:",
                error
            );

            res.status(500).json({
                error: error.message
            });
        }
    }
);


// ===============================
// LEARNING RECOMMENDATIONS
// ===============================

app.get(
    "/learning-recommendations/:studentId",
    async (req, res) => {
        try {
            const student = await Student.findById(
                req.params.studentId
            );

            const jobs = await Job.find();

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            if (
                typeof getLearningRecommendations !==
                "function"
            ) {
                return res.json([]);
            }

            const result =
                getLearningRecommendations(
                    student,
                    jobs
                );

            res.json(result || []);

        } catch (error) {
            console.error(
                "Learning recommendation error:",
                error.message
            );

            res.json([]);
        }
    }
);


// ===============================
// PLACEMENT READINESS
// ===============================

app.get(
    "/placement-readiness/:studentId/:jobId",
    async (req, res) => {
        try {
            const student = await Student.findById(
                req.params.studentId
            );

            const job = await Job.findById(
                req.params.jobId
            );

            if (!student || !job) {
                return res.status(404).json({
                    message: "Student or job not found"
                });
            }

            const result =
                calculatePlacementReadiness(
                    student,
                    job
                );

            res.json(result);

        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);


// ===============================
// DASHBOARD
// ===============================

app.get(
    "/dashboard/:studentId",
    async (req, res) => {
        try {
            const student = await Student.findById(
                req.params.studentId
            );

            const jobs = await Job.find();

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            if (typeof getDashboard !== "function") {
                return res.status(500).json({
                    error:
                        "Dashboard service is not exported correctly"
                });
            }

            const dashboard =
                await getDashboard(
                    student,
                    jobs,
                    getRecommendations,
                    getSkillGap,
                    checkEligibility,
                    getLearningRecommendations,
                    calculatePlacementReadiness
                );

            res.json(dashboard);

        } catch (error) {
            console.error(
                "Dashboard error:",
                error
            );

            res.status(500).json({
                error: error.message
            });
        }
    }
);


// ===============================
// MONGODB CONNECTION
// ===============================

const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/intelligentCampusPlacement";

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log(
            "MongoDB connected successfully"
        );
    })
    .catch((error) => {
        console.log(
            "MongoDB connection error:",
            error.message
        );
    });


// ===============================
// SERVER
// ===============================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});
