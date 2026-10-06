const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    minimumCGPA: {
        type: Number,
        required: true
    },
    requiredSkills: {
        type: [String],
        default: []
    },
    maximumArrears: {
        type: Number,
        default: 0
    },
    interviewDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Job", jobSchema);