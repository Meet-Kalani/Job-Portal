const employer = require('../models/employer');
const jobs = require('../models/jobs');
const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    try {
        // Finding user for verifying credentials
        employer.find({ mail: req.body.mail }, (err, success) => {
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

// routes for my listed jobs - START
router.get('/:employer_id/my-listed-jobs',(req,res)=>{
    employer.findOne({_id:req.params.employer_id},(err,foundEmployer)=>{
        if(err){
            res.json(err);
        } else{
            jobs.find({'_id':{$in: foundEmployer.job_postings}},(err,success)=>{
                if(err){
                  res.json(err);
                } else{
                  res.json(success);
                }
              })
        }
    })
})

router.post('/jobs',(req,res)=>{
    // Breaking down tags to separate them with "," (comma)
    delimetedTags = req.body.tags.trim().split(/\s+/);

    jobs.create({
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
    },(err,success)=>{
        if(err){
            res.json(err);
        } else{
            res.json(success);
        }
    })
})

router.put('/jobs/:id',(req,res)=>{

    // Breaking down tags to separate them with "," (comma)
    delimetedTags = req.body.tags.trim().split(/\s+/);

    jobs.findOneAndUpdate({_id: req.body.params.id},{
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

router.delete('/:job_id',(req,res)=>{
    jobs.deleteOne({_id:req.params.job_id},(err,success)=>{
        if(err){
            res.json(err);
        } else {
            res.json(success);
        }
    })
})
// routes for my listed jobs - END

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

// routes for feedback - START
router.get('/jobs/:job_id/candidates/:candidate_id/feedback/:feedback_id',(req,res)=>{
    feedback.findOne({_id: req.params.feedback_id},(err,success)=>{
        if(err){
            res.json(err);
        } else {
            res.json(success);
        }
    })
})
// routes for feedback - END

module.exports = router;