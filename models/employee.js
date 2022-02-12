// Importing Dependencies
const mongoose = require('mongoose');

// Database Connection String
mongoose.connect("mongodb://localhost/Job-Portal", { useNewUrlParser: true, useUnifiedTopology: true});

// Database Schema
let employeeSchema = new mongoose.Schema({
    name: String,
    mail: String,
    password: String,
    designation: String,
    job_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    have_authority: Boolean
})

// Exporting Model
module.exports = mongoose.model('employee', employeeSchema);