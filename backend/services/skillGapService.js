
function normalizeSkill(skill) {
    return String(skill || "")
        .trim()
        .toLowerCase();
}

function getSkillGap(student, job) {
    const studentSkills = (student.skills || [])
        .map(skill => normalizeSkill(skill))
        .filter(Boolean);

    const requiredSkills = (job.requiredSkills || [])
        .filter(Boolean);

    const matchedSkills = requiredSkills.filter(skill =>
        studentSkills.includes(normalizeSkill(skill))
    );

    const missingSkills = requiredSkills.filter(skill =>
        !studentSkills.includes(normalizeSkill(skill))
    );

    const matchPercentage =
        requiredSkills.length === 0
            ? 100
            : Math.round(
                (matchedSkills.length / requiredSkills.length) * 100
            );

    return {
        matchPercentage,
        matchedSkills,
        missingSkills
    };
}

module.exports = {
    getSkillGap
};
