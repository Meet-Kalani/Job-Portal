// Importing Dependencies
const mongoose = require('mongoose');

// Database Connection String
mongoose.connect("mongodb://localhost/Job-Portal", { useNewUrlParser: true, useUnifiedTopology: true});

// Database Schema
let employerSchema = new mongoose.Schema({
    company_mail:String,
    password:String,
    contact:Number,
    address:String,
    company_bio:String,
    company_profile_picture:{
        url:String,
        public_id:String
    },
    company_name:String,
    job_postings:[{
        type:mongoose.Schema.Types.ObjectId
    }]
})

// Exporting Model
module.exports = mongoose.model('Job-Portal', employerSchema);