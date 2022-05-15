// Importing Dependencies
const mongoose = require("mongoose");
const config = require('config');

// Database Connection String
mongoose.connect(`mongodb+srv://admin:${config.get('dbPassword')}@mongodb-job-portal.hzueb.mongodb.net/Job-Portal?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});

// Database Schema
let candidateSchema = new mongoose.Schema({
  mail: String,
  password: String,
  name: String,
  bio: String,
  profile_picture: {
    url: String,
    public_id: String,
  },
  join_date: {
    type: Date,
    default: Date.now,
  },
  place: String,
  contact: Number,
  skills: [String],
  age: String,
  resume: {
    url: String,
    public_id: String,
  },
  SSC: String,
  SSC_year: Number,
  HSC: String,
  HSC_year: Number,
  UG_course_name: String,
  UG_university: String,
  UG_institute_name: String,
  UG_passing_year: Number,
  UG_percentage: String,
  PG_course_name: String,
  PG_university: String,
  PG_institute_name: String,
  PG_passing_year: Number,
  PG_percentage: String,
  chatroom_id:[
    {
      type:mongoose.Schema.Types.ObjectId
    }
  ],
  applied_jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  feedbacks: [
    {
      description: String,
      overall_feedback: String,
      status: String,
      job_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      company_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
});

// Exporting Model
module.exports = mongoose.model("candidate", candidateSchema);
