// Importing Dependencies
const mongoose = require('mongoose');

// Database Connection String
mongoose.connect("mongodb://localhost/Job-Portal", { useNewUrlParser: true, useUnifiedTopology: true});

// Database Schema
let adminSchema = new mongoose.Schema({
    mail: String,
    password: String,
    admin_name: String,
    have_authority: Boolean    
})

// Exporting Model
module.exports = mongoose.model('admin', adminSchema);