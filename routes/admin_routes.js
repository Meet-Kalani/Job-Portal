const jobs = require('../models/jobs');
const candidate = require('../models/candidate');
const feedback = require('../models/feedback');
const express = require('express');
const router = express.Router();

// routes for CRUD operations of job postings - START
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

router.delete('/jobs/:id',(req,res)=>{
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
router.get('/jobs/:job_id/candidates',(req,res)=>{
    let listOfCandidates;
    jobs.findOne({_id: req.params.job_id},(err,foundJob)=>{
        if(err){
            res.send(err)
        } else {
            foundJob.candidate_id.map( id => {
                candidate.findOne({_id:id},(err,foundCandidate)=>{
                    if(err){
                        res.send(err);
                    } else{
                        listOfCandidates.push(foundCandidate);
                    }
                })
            })
        }
    })

    res.send(listOfCandidates);
})
// routes for getting list of candidates who are applied for jobs - END

// routes for feedback - START
router.get('/jobs/:job_id/candidates/:candidate_id/feedback/:feedback_id',(req,res)=>{
    feedback.findOne({_id: req.params.feedback_id},(err,success)=>{
        if(err){
            res.send(err);
        } else {
            res.send(success);
        }
    })
})

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