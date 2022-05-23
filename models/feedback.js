// Importing Dependencies
const mongoose = require('mongoose');
const config = require('config');

// Database Connection String
mongoose.connect(`mongodb+srv://admin:${config.get('dbPassword')}@mongodb-job-portal.hzueb.mongodb.net/Job-Portal?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect("mongodb://localhost/Job-Portal", {useNewUrlParser: true,  useUnifiedTopology: true,});

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