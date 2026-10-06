
function normalizeSkill(skill) {
    return String(skill || "")
        .trim()
        .toLowerCase();
}

function calculatePlacementReadiness(student, job) {
    const studentSkills = (student.skills || [])
        .map(skill => normalizeSkill(skill))
        .filter(Boolean);

    const requiredSkills = (job.requiredSkills || [])
        .map(skill => normalizeSkill(skill))
        .filter(Boolean);

    const matchedSkills = requiredSkills.filter(skill =>
        studentSkills.includes(skill)
    );

    const skillScore =
        requiredSkills.length === 0
            ? 100
            : Math.round(
                (matchedSkills.length / requiredSkills.length) * 100
            );

    /*
     * CGPA score
     */

    let cgpaScore = 100;

    if (
        job.minimumCGPA !== undefined &&
        job.minimumCGPA > 0
    ) {
        cgpaScore = Math.min(
            100,
            Math.round(
                (student.cgpa / job.minimumCGPA) * 100
            )
        );
    }

    /*
     * Arrears score
     */

    let arrearsScore = 100;

    if (
        job.maximumArrears !== undefined &&
        student.arrears > job.maximumArrears
    ) {
        arrearsScore = 0;
    } else if (student.arrears > 0) {
        arrearsScore = 50;
    }

    /*
     * Skill has the highest importance.
     */

    const readinessScore = Math.max(
        0,
        Math.min(
            100,
            Math.round(
                skillScore * 0.70 +
                cgpaScore * 0.20 +
                arrearsScore * 0.10
            )
        )
    );

    return {
        readinessScore,
        skillScore,
        cgpaScore,
        arrearsScore
    };
}

module.exports = {
    calculatePlacementReadiness
};
