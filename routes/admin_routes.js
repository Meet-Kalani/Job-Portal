// Importing dependencies
const jobs = require('../models/jobs');
const candidate = require('../models/candidate');
const employer = require('../models/employer');
const admin = require('../models/admin');
const feedback = require('../models/feedback');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('config');
const router = express.Router();
const cors = require('cors');
router.use(cors());

// Admin routes - START
// login route
router.post('/login', (req, res) => {
    try {
        console.log(req.body);
        // Finding user for verifying credentials
        admin.find({ admin_mail: req.body.mail }, (err, success) => {
            if (err || success.length == 0) {
                console.log(err,success)
                res.json({
                    success: false,
                    message: 'Invalid Credentials!'
                });
            } else {
                const tokenCredentials = {
                    userID: success[0]._id,
                    admin_name: success[0].admin_name,
                    admin_mail: success[0].admin_mail,
                }
                // Signning the jwt token
                let token = jwt.sign({ credentials: tokenCredentials }, config.get('jwtPrivateKey'));
                bcrypt.compare(req.body.password, success[0].password, function (err, result) {
                    console.log("Logged In : " + result);
                    if (result == true) {
                        console.log('---------------------------------------------');
                        console.log("Logged In User Name: " + success[0].admin_name);
                        console.log("Logged In User Mail: " + success[0].admin_mail);
                        console.log('---------------------------------------------');
  
                        // Sending response to client
                        res.json({
                            success: true,
                            message: 'Authentication successful!',
                            admin_name: success[0].admin_name,
                            token: token
                        });
                    } else {
                        res.json({
                            success: false,
                            message: 'Invalid Credentials!'
                        });
                    }
                });
            }
        })
    } catch (err) {
        res.json(err)
    }
  })

//   route for getting all the candidates there are on our site
router.get('/candidates',auth,(req,res)=>{
    candidate.find({},{password: 0},(err,success)=>{
        if(err){
            res.json(err);
        } else{
            res.json(success);
        }
    })
})

//   route for getting all the employers there are on our site
router.get('/employers',auth,(req,res)=>{
    employer.find({},{password: 0},(err,success)=>{
        if(err){
            res.json(err);
        } else{
            res.json(success);
        }
    })
})

// routes for CRUD operations of job postings - START
// route for getting all the jobs that ar elisted on our site
router.get('/jobs',(req,res)=> {
    jobs.find({},(err,success)=>{
        if(err){
            res.json(err);
        } else{
            res.json(success);
        }
    })
})

// route for getting specific job using its id
router.get('/jobs/:id',(req,res)=>{
    jobs.findOne({_id: req.params.id},(err,success)=>{
        if(err){
            res.json(err);
        } else{
            res.json(success);
        }
    })
})

// route for editing the job
router.put('/jobs/:id',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    // Breaking down tags to separate them with "," (comma)
    delimetedTags = req.body.tags.trim().split(/\s+/);

    jobs.findOneAndUpdate({_id: req.params.id},{
        title:req.body.title,
        description:req.body.description,
        designation:req.body.designation,
        vacancy:req.body.vacancy,
        pay:req.body.pay,
        experience: req.body.experience,
        location: req.body.location,
        tags: delimetedTags,
        qualifications: req.body.qualifications,
        status: req.body.status,
        company_id: req.body.company_id,
        feedback_id: req.body.feedback_id,
        candidate_id: req.body.candidate_id
    },(err,success)=>{
        if(err){
            res.json(err);
        } else{
            res.json(success);
        }
    })
})

// route for deleting the job
router.delete('/jobs/:id',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    jobs.deleteOne({_id:req.params.id},(err,success)=>{
        if(err){
            res.json(err);
        } else{
            res.json(success);
        }
    })
})
// routes for CRUD operations of job postings - END

// routes for getting list of candidates who are applied for jobs - START
router.get('/jobs/:job_id/candidates',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    let listOfCandidates;
    jobs.findOne({_id: req.params.job_id},(err,foundJob)=>{
        if(err){
            res.json(err)
        } else {
            foundJob.candidate_id.map( id => {
                candidate.findOne({_id:id},(err,foundCandidate)=>{
                    if(err){
                        res.json(err);
                    } else{
                        listOfCandidates.push(foundCandidate);
                    }
                })
            })
        }
    })

    res.json(listOfCandidates);
})
// routes for getting list of candidates who are applied for jobs - END

// routes for feedback - START
router.get('/jobs/:job_id/candidates/:candidate_id/feedback/:feedback_id',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    feedback.findOne({_id: req.params.feedback_id},(err,success)=>{
        if(err){
            res.json(err);
        } else {
            res.json(success);
        }
    })
})

// routes for candidate's data - START
router.get('/jobs/:job_id/candidates/:candidate_id',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    candidate.findOne({_id:req.params.candidate_id},(err,success)=>{
        if(err){
            res.json(err);
        } else {
            res.json(success);
        }
    })
})
// routes for candidate's data - END
// Admin routes - END

module.exports = router;