
function normalizeSkill(skill) {
    return String(skill || "")
        .trim()
        .toLowerCase();
}

function checkEligibility(student, job) {
    const reasons = [];

    const studentSkills = (student.skills || [])
        .map(skill => normalizeSkill(skill))
        .filter(Boolean);

    const requiredSkills = (job.requiredSkills || [])
        .map(skill => normalizeSkill(skill))
        .filter(Boolean);

    const matchedSkills = requiredSkills.filter(skill =>
        studentSkills.includes(skill)
    );

    const skillMatch =
        requiredSkills.length === 0
            ? 100
            : Math.round(
                (matchedSkills.length / requiredSkills.length) * 100
            );

    /*
     * SKILL-FIRST ELIGIBILITY
     *
     * 100%       -> Highly Eligible
     * 75-99%     -> Eligible
     * 50-74%     -> Not Eligible
     * Below 50%  -> Not Eligible
     */

    let eligibilityLevel = "Not Eligible";

    if (skillMatch === 100) {
        eligibilityLevel = "Highly Eligible";
    } else if (skillMatch >= 75) {
        eligibilityLevel = "Eligible";
    } else if (skillMatch >= 50) {
        eligibilityLevel = "Not Eligible - Skills Need Improvement";
    } else {
        eligibilityLevel = "Not Eligible";
    }

    /*
     * Skill is the primary condition.
     * If skill match is below 75%, the student is not eligible.
     */

    if (skillMatch < 75) {
        reasons.push(
            `Skill match is only ${skillMatch}%. Minimum 75% skill match is required.`
        );
    }

    /*
     * CGPA is a secondary condition.
     */

    if (
        job.minimumCGPA !== undefined &&
        student.cgpa < job.minimumCGPA
    ) {
        reasons.push(
            `CGPA ${student.cgpa} is below the required ${job.minimumCGPA}.`
        );
    }

    /*
     * Arrears are a secondary condition.
     */

    if (
        job.maximumArrears !== undefined &&
        student.arrears > job.maximumArrears
    ) {
        reasons.push(
            `Arrears exceed the allowed limit of ${job.maximumArrears}.`
        );
    }

    const cgpaEligible =
        job.minimumCGPA === undefined ||
        student.cgpa >= job.minimumCGPA;

    const arrearsEligible =
        job.maximumArrears === undefined ||
        student.arrears <= job.maximumArrears;

    const skillEligible = skillMatch >= 75;

    const eligible =
        skillEligible &&
        cgpaEligible &&
        arrearsEligible;

    return {
        eligible,
        eligibilityLevel,
        skillMatch,
        matchedSkills,
        missingSkills: requiredSkills.filter(
            skill => !studentSkills.includes(skill)
        ),
        reasons
    };
}

module.exports = {
    checkEligibility
};
