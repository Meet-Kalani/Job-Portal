// Importing Dependencies
const mongoose = require('mongoose');
const config = require('config');

// Database Connection String
mongoose.connect(`mongodb+srv://admin:${config.get('dbPassword')}@mongodb-job-portal.hzueb.mongodb.net/Job-Portal?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});

// Database Schema
let chatroomSchema = new mongoose.Schema({
    job_id:mongoose.Schema.Types.ObjectId,
    candidate_id:mongoose.Schema.Types.ObjectId,
       
})

// Exporting Model
module.exports = mongoose.model('chatroom', chatroomSchema);