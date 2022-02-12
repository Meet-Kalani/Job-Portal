// Importing Dependencies
const mongoose = require('mongoose');

// Database Connection String
mongoose.connect("mongodb://localhost/Job-Portal", { useNewUrlParser: true, useUnifiedTopology: true});

// Database Schema
let feedbackSchema = new mongoose.Schema({
    description: String,
    overall_feedback: String,
    status: String,
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId
    }
})

// Exporting Model
module.exports = mongoose.model('feedback', feedbackSchema);