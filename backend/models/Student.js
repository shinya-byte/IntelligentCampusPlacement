const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    cgpa: {
        type: Number,
        required: true
    },

    skills: {
        type: [String],
        default: []
    },

    projects: {
        type: [String],
        default: []
    },

    certifications: {
        type: [String],
        default: []
    },

    arrears: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Student", studentSchema);