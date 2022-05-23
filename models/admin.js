// Importing Dependencies
const mongoose = require('mongoose');
const config = require('config');

// Database Connection String
mongoose.connect(`mongodb+srv://admin:${config.get('dbPassword')}@mongodb-job-portal.hzueb.mongodb.net/Job-Portal?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect("mongodb://localhost/Job-Portal", {useNewUrlParser: true,  useUnifiedTopology: true,});

// Database Schema
let adminSchema = new mongoose.Schema({
    admin_mail: String,
    password: String,
    admin_name: String,
    have_authority: Boolean    
})

// Exporting Model
module.exports = mongoose.model('admin', adminSchema);