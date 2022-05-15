// Importing Dependencies
const mongoose = require('mongoose');
const config = require('config');

// Database Connection String
mongoose.connect(`mongodb+srv://admin:${config.get('dbPassword')}@mongodb-job-portal.hzueb.mongodb.net/Job-Portal?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});

// Database Schema
let employeeSchema = new mongoose.Schema({
    employee_name: String,
    employee_mail: String,
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