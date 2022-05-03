const employer = require('../models/employer');
const candidate = require('../models/candidate');
const feedback = require('../models/feedback');
const jobs = require('../models/jobs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

router.post('/signup', (req, res) => {
    try {
        // Checking if user Exists
        employer.findOne({ company_mail: req.body.company_mail }, (err, success) => {
            if (err) {
                throw err;
            } else{
                if (success === null) {
            // Hashing password to store in db
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                // creating user and saving it
                employer.create({
                    company_name: req.body.company_name,
                    company_mail: req.body.company_mail,
                    password: hash,
                }, (err, success) => {
                    if (err) {
                        console.log(err)
                        res.json(err);
                    } else {
                        console.log(success)
                        console.log('New user signed up');
                        console.log('---------------------------------------------');
                        console.log('User Name: ' + success.company_name);
                        console.log('User Mail: ' + success.company_mail);
                        console.log('---------------------------------------------');
                        console.log('')
                        // Sending response to client
                        res.json(success);
                    }
                });
            });
        }
  
            }
        })
  
        
    } catch (err) {
        res.json(err);
    }
  })

router.post('/login', (req, res) => {
    try {
        // Finding user for verifying credentials
        employer.find({ company_mail: req.body.mail }, (err, success) => {
            if (err || success.length == 0) {
                res.json({
                    success: false,
                    message: 'Invalid Credentials!'
                });
            } else {
                const tokenCredentials = {
                    userID: success[0]._id,
                    company_name: success[0].company_name,
                    company_mail: success[0].company_mail,
                }
                let token = jwt.sign({ credentials: tokenCredentials }, "JustTheTwoOfUs");
                bcrypt.compare(req.body.password, success[0].password, function (err, result) {
                    console.log("Logged In : " + result);
                    if (result == true) {
                        console.log('---------------------------------------------');
                        console.log("Logged In User Name: " + success[0].company_name);
                        console.log("Logged In User Mail: " + success[0].company_mail);
                        console.log('---------------------------------------------');
  
                        // Sending response to client
                        res.json({
                            success: true,
                            message: 'Authentication successful!',
                            company_name: success[0].company_name,
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

router.get('/:employer_id',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, 'JustTheTwoOfUs');

    employer.findOne({_id:req.params.employer_id},(err,success)=>{
        if(err){
            res.json(err);
        } else{
            res.json(success)
            
        }
    })
})

// routes for my listed jobs - START
router.get('/:employer_id/my-listed-jobs',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, 'JustTheTwoOfUs');

    employer.findOne({_id:req.params.employer_id},(err,foundEmployer)=>{
        if(err){
            console.log(err);
            res.json(err);
        } else{
            console.log(foundEmployer);
            jobs.find({'_id':{$in: foundEmployer.job_postings}},(err,success)=>{
                if(err){
                console.log(err)
                  res.json(err);
                } else{
                    console.log(success)
                  res.json(success);
                }
              })
        }
    })
})

router.post('/jobs',auth,(req,res)=>{
    console.log(req.body)
// Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, 'JustTheTwoOfUs');

    // Breaking down tags to separate them with "," (comma)
    delimetedTags = req.body.tags.trim().split(/\s+/);
    delimetedSkills = req.body.skills.trim().split(/\s+/);
    delimetedPerks = req.body.perks.trim().split(/\s+/);

    jobs.create({
        title:req.body.title,
        description:req.body.description,
        designation:req.body.designation,
        vacancy:req.body.vacancy,
        pay:req.body.pay,
        experience: req.body.experience,
        location: req.body.location,
        tags: delimetedTags,
        skills:delimetedSkills,
        perks:delimetedPerks,
        description_about_designation:req.body.description_about_designation,
        qualifications: req.body.qualifications,
        status: req.body.status,
        company_id: req.body.company_id,
        company_name: decoded.credentials.company_name
    },(err,success)=>{
        if(err){
            console.log(err);
            res.json(err);
        } else{
            console.log(success);
            employer.findOneAndUpdate({_id:req.body.company_id},{$push:{job_postings:success._id}},(err,ex)=>{
                if(err){
                    console.log(err);
                } else{
                    console.log(ex)
                }
            });
            res.json(success);
        }
    })
})

router.put('/jobs/:id',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, 'JustTheTwoOfUs');


    // Breaking down tags to separate them with "," (comma)
    delimetedTags = req.body.tags.trim().split(/\s+/);
    delimetedSkills = req.body.skills.trim().split(/\s+/);
    delimetedPerks = req.body.perks.trim().split(/\s+/);

    console.log(delimetedSkills,delimetedPerks);

    jobs.findOneAndUpdate({_id: req.params.id},{
        title:req.body.title,
        description:req.body.description,
        designation:req.body.designation,
        vacancy:req.body.vacancy,
        pay:req.body.pay,
        experience: req.body.experience,
        location: req.body.location,
        tags: delimetedTags,
        skills:delimetedSkills,
        perks:delimetedPerks,
        description_about_designation:req.body.description_about_designation,
        qualifications: req.body.qualifications,
        status: req.body.status,
        company_id: req.body.company_id,
        feedback_id: req.body.feedback_id,
        candidate_id: req.body.candidate_id,
        company_name:req.body.company_name
    },(err,success)=>{
        if(err){
            res.json(err);
        } else{
            console.log(success)
            res.json(success);
        }
    })
})

router.delete('/:job_id',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, 'JustTheTwoOfUs');

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
router.get('/jobs/:job_id/candidates',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, 'JustTheTwoOfUs');

    // let listOfCandidates = [];
    jobs.findOne({_id: req.params.job_id},(err,foundJob)=>{
        if(err){
            res.json(err)
        } else {
                candidate.findOne({'_id':{$in:foundJob.candidate_id}},(err,foundCandidate)=>{
                    if(err){
                        res.json(err);
                    } else{
                        // listOfCandidates.push(foundCandidate);
                        console.log(foundCandidate);
                        res.json(foundCandidate);
                    }
                })
        }
    })

    // res.json(listOfCandidates);
    // console.log(listOfCandidates);
})
// routes for getting list of candidates who are applied for jobs - END

// routes for candidate's data - START
router.get('/jobs/:job_id/candidates/:candidate_id',auth,(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, 'JustTheTwoOfUs');

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
router.get('/feedback/:job_id/:candidate_id',auth,async(req,res)=>{
    // Verifying Access Token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let decoded = jwt.verify(token, 'JustTheTwoOfUs');

    let candidateData = await candidate.findById({_id:req.params.candidate_id})

//   let feedbackData = await feedback.findOne({
//     "_id":{
//         $elemMatch:{
//             $eq = 
//         }
//     }
//   })
})
// routes for feedback - END

module.exports = router;

// {_id:{$in:candidateData.feedback}} embed the enitere doc