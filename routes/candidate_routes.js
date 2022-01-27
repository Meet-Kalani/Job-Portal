const jobs = require('../models/jobs');
const candidate = require('../models/candidate');
const feedback = require('../models/feedback');
const express = require('express');
const router = express.Router();

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

// routes for candidate profile - START
router.get('/profile/:candidate_id',(req,res)=>{
    candidate.findOne({_id:req.params.candidate_id},(err,success)=>{
        if(err){
            res.json(err);
        } else{
            res.json(success);
        }
    })
})

router.put('/profile/:candidate_id/edit',(req,res)=>{
    // candidate.findOneAndUpdate({_id:req.params.candidate_id},)
})


module.exports = router;
