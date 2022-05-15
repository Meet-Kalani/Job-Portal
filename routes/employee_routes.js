// Importing dependencies
const jobs = require('../models/jobs');
const candidate = require('../models/candidate');
const employee = require('../models/employee');
const feedback = require('../models/feedback');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
router.use(cors());

// route for employee login
router.post('/login', (req, res) => {
    try {
        // Finding user for verifying credentials
        employee.find({ mail: req.body.mail }, (err, success) => {
            if (err || success.length == 0) {
                res.json({
                    success: false,
                    message: 'Invalid Credentials!'
                });
            } else {
                const tokenCredentials = {
                    userID: success[0]._id,
                    name: success[0].name,
                    mail: success[0].mail,
                }
                let token = jwt.sign({ credentials: tokenCredentials },config.get('jwtPrivateKey'));
                bcrypt.compare(req.body.password, success[0].password, function (err, result) {
                    console.log("Logged In : " + result);
                    if (result == true) {
                        console.log('---------------------------------------------');
                        console.log("Logged In User Name: " + success[0].name);
                        console.log("Logged In User Mail: " + success[0].mail);
                        console.log('---------------------------------------------');
  
                        // Sending response to client
                        res.json({
                            success: true,
                            message: 'Authentication successful!',
                            name: success[0].name,
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

// routes for job postings - START
// route for getting all the jobs
router.get('/jobs',auth,(req,res)=> {
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    jobs.find({},(err,success)=>{
        if(err){
            res.json(err);
        } else{
            res.json(success);
        }
    })
})

// route for getting specific jobs by id
router.get('/jobs/:id',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    jobs.findOne({_id: req.params.id},(err,success)=>{
        if(err){
            res.json(err);
        } else{
            res.json(success);
        }
    })
})
// routes for job postings - END

// routes for getting list of candidates who are applied for jobs - START
router.get('/jobs/:job_id/candidates',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    let listOfCandidates = [];
    jobs.findOne({_id: req.params.job_id},(err,foundJob)=>{
        if(err){
            res.json(err)
        } else {
            let len = foundJob.candidate_id.length;
            foundJob.candidate_id.map( (id,i)=> {
                candidate.findOne({_id:id},(err,foundCandidate)=>{
                    if(err){
                        res.json(err);
                    } else{
                                    
                        if(foundCandidate !== null){
                            listOfCandidates.push(foundCandidate);
                        }
                        
                        if(len === i+1){
                            res.json(listOfCandidates)                     
                        }
                    }
                })
            })
        }
    })
})
// routes for getting list of candidates who are applied for jobs - END

// routes for feedback - START
router.post('/jobs/:job_id/candidates/:candidate_id/feedback',auth,async(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    let dataToBePushed = {
        description: req.body.description,
        overall_feedback: req.body.overall_feedback,
        status: "Done",
        job_id: req.params.job_id,
        company_id:req.body.company_id
    };

    candidate.update({_id:req.params.candidate_id},{$push:{feedbacks:dataToBePushed}},(err,success)=>{
            if(err){
                res.json(err)
            } else{
                console.log(success)
                res.json({
                    success:true,
                    message:'Feedback has been saved.'
                })
            }
        })

})
// routes for feedback - END

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

module.exports = router;
