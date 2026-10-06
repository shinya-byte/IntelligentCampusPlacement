function getRecommendations(
    student,
    jobs,
    calculateSkillGap,
    checkEligibility
) {
    const recommendations = [];

    for (const job of jobs) {
        const eligibility = checkEligibility(student, job);

        // Only eligible jobs should appear in Recommendations
        if (!eligibility.eligible) {
            continue;
        }

        const skillGap = calculateSkillGap(
            student.skills || [],
            job.requiredSkills || []
        );

        recommendations.push({
            jobId: job._id,
            company: job.company,
            jobTitle: job.jobTitle,
            department: job.department,

            minimumCGPA: job.minimumCGPA,
            maximumArrears: job.maximumArrears,
            interviewDate: job.interviewDate,

            requiredSkills: job.requiredSkills || [],

            eligibility: {
                eligible: true,
                reasons: eligibility.reasons || []
            },

            matchPercentage: skillGap.matchPercentage,
            matchedSkills: skillGap.matchedSkills || [],
            missingSkills: skillGap.missingSkills || []
        });
    }

    recommendations.sort(
        (a, b) => b.matchPercentage - a.matchPercentage
    );

    return recommendations;
}

module.exports = {
    getRecommendations
};