
function getDashboard(
    student,
    jobs,
    getRecommendations,
    getSkillGap,
    checkEligibility,
    getLearningRecommendations,
    calculatePlacementReadiness
) {
    const safeSkills = student.skills || [];

    /*
     * RECOMMENDED JOBS
     *
     * Only jobs where the student is eligible.
     */

    const recommendations = [];

    for (const job of jobs) {
        const eligibility = checkEligibility(student, job);

        if (!eligibility.eligible) {
            continue;
        }

        const skillGap = getSkillGap(student, job);

        recommendations.push({
            jobId: job._id,
            company: job.company,
            jobTitle: job.jobTitle,
            department: job.department,

            minimumCGPA: job.minimumCGPA,
            maximumArrears: job.maximumArrears,
            interviewDate: job.interviewDate,

            requiredSkills: job.requiredSkills || [],

            matchPercentage: skillGap.matchPercentage || 0,

            matchedSkills: skillGap.matchedSkills || [],

            missingSkills: skillGap.missingSkills || [],

            eligibility: {
                eligible: true,
                reasons: eligibility.reasons || []
            }
        });
    }

    recommendations.sort(
        (a, b) =>
            b.matchPercentage -
            a.matchPercentage
    );


    /*
     * COMPLETE JOB ANALYSIS
     *
     * Every job gets its own:
     * - eligibility
     * - skill gap
     * - readiness
     * - learning recommendations
     *
     * Learning is NOT combined into one overall list.
     */

    const jobAnalysis = jobs.map((job) => {

        const eligibility =
            checkEligibility(
                student,
                job
            );

        const skillGap =
            getSkillGap(
                student,
                job
            );

        const readiness =
            calculatePlacementReadiness(
                student,
                job
            );

        /*
         * Learning is generated ONLY
         * from this specific job's missing skills.
         */

        const learningRecommendations =
            getLearningRecommendations(
                skillGap.missingSkills || []
            );

        return {
            jobId: job._id,

            company: job.company,

            jobTitle: job.jobTitle,

            department: job.department,

            minimumCGPA: job.minimumCGPA,

            maximumArrears: job.maximumArrears,

            interviewDate: job.interviewDate,

            requiredSkills:
                job.requiredSkills || [],

            eligibility,

            skillGap,

            readiness,

            learningRecommendations
        };
    });


    /*
     * RETURN DASHBOARD DATA
     */

    return {
        student: {
            id: student._id,

            name: student.name,

            email: student.email,

            department: student.department,

            cgpa: student.cgpa,

            skills: safeSkills,

            projects:
                student.projects || [],

            certifications:
                student.certifications || [],

            arrears:
                student.arrears || 0
        },

        /*
         * Only eligible jobs.
         */
        recommendedJobs: recommendations,

        /*
         * Job-by-job intelligence.
         *
         * This is the important data source for:
         * Recommendations
         * Skill Gap
         * Learning
         */
        jobAnalysis,

        /*
         * No overall/general learning list.
         *
         * Learning must be selected from
         * a specific job's missing skills.
         */
        learningRecommendations: []
    };
}

module.exports = {
    getDashboard
};
