// Importing Dependencies
const mongoose = require('mongoose');

// Database Connection String
mongoose.connect("mongodb://localhost/Job-Portal", { useNewUrlParser: true, useUnifiedTopology: true});

// Database Schema
let chatroomSchema = new mongoose.Schema({
    job_id:mongoose.Schema.Types.ObjectId,
    candidate_id:mongoose.Schema.Types.ObjectId,
       
})

// Exporting Model
module.exports = mongoose.model('chatroom', chatroomSchema);