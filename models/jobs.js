// Importing Dependencies
const mongoose = require("mongoose");
const config = require('config');

// Database Connection String
// mongoose.connect("mongodb://localhost/Job-Portal", {useNewUrlParser: true,  useUnifiedTopology: true,});
mongoose.connect(`mongodb+srv://admin:${config.get('dbPassword')}@mongodb-job-portal.hzueb.mongodb.net/Job-Portal?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});

// Database Schema
let jobsSchema = new mongoose.Schema({
  title: String,
  description: String,
  designation: String,
  vacancy: Number,
  pay: Number,
  company_name:String,
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  candidate_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  chatroom_id: {
      type: mongoose.Schema.Types.ObjectId
  },
  experience: String,
  location: String,
  tags: [String],
  qualifications: String,
  feedback_id: {
      type: mongoose.Schema.Types.ObjectId
  },
  status: String,
  perks: [String],
  description_about_designation: String,
  skills: [String]
});

// Exporting Model
module.exports = mongoose.model("jobs", jobsSchema);
