const jobs = require('../models/jobs');
const candidate = require('../models/candidate');
const employee = require('../models/employee');
const feedback = require('../models/feedback');
const express = require('express');
const router = express.Router();

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
                // let token = jwt.sign({ credentials: tokenCredentials }, config.get('jwtPrivateKey'));
                bcrypt.compare(req.body.password, success[0].password, function (err, result) {
                    console.log("Logged In : " + result);
                    if (result == true) {
                        console.log('---------------------------------------------');
                        console.log("Logged In User Name: " + success[0].userName);
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
router.get('/jobs',(req,res)=> {
    jobs.find({},(err,success)=>{
        if(err){
            res.json(err);
        } else{
            res.json(success);
        }
    })
})

router.get('/jobs/:id',(req,res)=>{
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
router.get('/jobs/:job_id/candidates',(req,res)=>{
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

// router.post('/jobs/:job_id/candidates/:candidate_id/feedback',(req,res)=>{
//     feedback.create({
//         description: req.body.description,
//         overall_feedback: req.body.overall_feedback,
//         status: "Done",
//         candidate_id: req.params.candidate_id,
//         job_id: req.params.job_id,
        
//     })
// })
// routes for feedback - END

// routes for candidate's data - START
router.get('/jobs/:job_id/candidates/:candidate_id',(req,res)=>{
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
