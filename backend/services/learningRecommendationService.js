
function getLearningRecommendations(missingSkills) {
    const recommendations = [];

    const learningMap = {
        Java: {
            topic: "Java Programming",
            level: "Beginner to Intermediate",
            priority: "High",
            focus: [
                "Java Basics",
                "OOP",
                "Collections",
                "Exception Handling"
            ]
        },

        Python: {
            topic: "Python Programming",
            level: "Beginner to Intermediate",
            priority: "High",
            focus: [
                "Python Basics",
                "Functions",
                "OOP",
                "Data Structures"
            ]
        },

        SQL: {
            topic: "SQL and Database Management",
            level: "Beginner to Intermediate",
            priority: "High",
            focus: [
                "SELECT Queries",
                "JOIN",
                "GROUP BY",
                "Subqueries"
            ]
        },

        JavaScript: {
            topic: "JavaScript",
            level: "Beginner to Intermediate",
            priority: "High",
            focus: [
                "ES6",
                "Functions",
                "Arrays",
                "Async Programming"
            ]
        },

        React: {
            topic: "React.js",
            level: "Intermediate",
            priority: "Medium",
            focus: [
                "Components",
                "Props",
                "State",
                "React Hooks"
            ]
        },

        "Node.js": {
            topic: "Node.js Backend Development",
            level: "Intermediate",
            priority: "Medium",
            focus: [
                "Express.js",
                "REST API",
                "Middleware",
                "MongoDB"
            ]
        },

        MongoDB: {
            topic: "MongoDB",
            level: "Beginner to Intermediate",
            priority: "Medium",
            focus: [
                "CRUD",
                "Queries",
                "Schema Design",
                "Mongoose"
            ]
        },

        HTML: {
            topic: "HTML",
            level: "Beginner",
            priority: "High",
            focus: [
                "Semantic HTML",
                "Forms",
                "Tables",
                "DOM Basics"
            ]
        },

        CSS: {
            topic: "CSS",
            level: "Beginner to Intermediate",
            priority: "Medium",
            focus: [
                "Selectors",
                "Flexbox",
                "Grid",
                "Responsive Design"
            ]
        },

        "Data Structures": {
            topic: "Data Structures and Algorithms",
            level: "Intermediate",
            priority: "High",
            focus: [
                "Arrays",
                "Linked Lists",
                "Stacks and Queues",
                "Searching and Sorting"
            ]
        }
    };

    const skills = Array.isArray(missingSkills)
        ? missingSkills
        : [];

    for (const skill of skills) {
        const cleanSkill = String(skill).trim();

        if (!cleanSkill) {
            continue;
        }

        const matchedSkill = Object.keys(learningMap).find(
            key =>
                key.toLowerCase() ===
                cleanSkill.toLowerCase()
        );

        if (matchedSkill) {
            recommendations.push({
                skill: cleanSkill,
                recommendation:
                    learningMap[matchedSkill].topic,
                level:
                    learningMap[matchedSkill].level,
                priority:
                    learningMap[matchedSkill].priority,
                focusAreas:
                    learningMap[matchedSkill].focus
            });
        } else {
            recommendations.push({
                skill: cleanSkill,
                recommendation: `Learn ${cleanSkill}`,
                level: "Beginner to Intermediate",
                priority: "Medium",
                focusAreas: [
                    `${cleanSkill} Basics`,
                    `${cleanSkill} Practical Applications`
                ]
            });
        }
    }

    return recommendations;
}

module.exports = {
    getLearningRecommendations
};
