// Importing Dependencies
const mongoose = require('mongoose');

// Database Connection String
mongoose.connect("mongodb://localhost/Job-Portal", { useNewUrlParser: true, useUnifiedTopology: true});

// Database Schema
let candidateSchema = new mongoose.Schema({
    mail:String,
    password:String,
    name:String,
    bio:String,
    profile_picture: {
        url:String,
        public_id:String
    },
    join_date:{
        type:Date,
        default:Date.now
    },
    place:String,
    contact:Number,
    skills:[String],
    age:String,
    resume:{
        url:String,
        public_id:String
    },
    SSC:String,
    SSC_year:Number,
    HSC:String,
    HSC_year:Number,
    UG_course_name:String,
    UG_university:String,
    UG_institute_name:String,
    UG_passing_year:Number,
    UG_percentage:String,
    PG_course_name:String,
    PG_university:String,
    PG_institute_name:String,
    PG_passing_year:Number,
    PG_percentage:String,
    applied_jobs:[{
        type:mongoose.Schema.Types.ObjectId
    }]
})

// Exporting Model
module.exports = mongoose.model('Job-Portal', candidateSchema);