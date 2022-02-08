const jobs = require("../models/jobs");
const candidate = require("../models/candidate");
const feedback = require("../models/feedback");
const express = require("express");
const router = express.Router();

router.post('/signup', (req, res) => {
  try {
      // Checking if user Exists
      candidate.findOne({ mail: req.body.mail }, (err, success) => {
          if (err) {
              throw err;
          } else{
              if (success === null) {
          // Hashing password to store in db
          bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
              // creating user and saving it
              candidate.create({
                  name: req.body.name,
                  mail: req.body.mail,
                  password: hash,
              }, (err, success) => {
                  if (err) {
                      res.json(err);
                  } else {
                      console.log('New user signed up');
                      console.log('---------------------------------------------');
                      console.log('User Name: ' + success.name);
                      console.log('User Mail: ' + success.mail);
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
      candidate.find({ mail: req.body.mail }, (err, success) => {
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
router.get("/jobs", (req, res) => {
  jobs.find({}, (err, success) => {
    if (err) {
      res.json(err);
    } else {
      res.json(success);
    }
  });
});

router.get("/jobs/:id", (req, res) => {
  jobs.findOne({ _id: req.params.id }, (err, success) => {
    if (err) {
      res.json(err);
    } else {
      res.json(success);
    }
  });
});
// routes for job postings - END

// routes for candidate profile - START
router.get("/profile/:candidate_id", (req, res) => {
  candidate.findOne({ _id: req.params.candidate_id }, (err, success) => {
    if (err) {
      res.json(err);
    } else {
      res.json(success);
    }
  });
});

router.put("/profile/:candidate_id/edit", (req, res) => {
  candidate.findOneAndUpdate(
    { _id: req.params.candidate_id },
    {
      name: req.body.name,
      bio: req.body.bio,
      profile_picture: {
        url: req.body.profile_picture_url,
        public_id: req.body.public_id,
      },
      place: req.body.place,
      contact: req.body.contact,
      skills: req.body.skills,
      age: req.body.age,
      resume: {
        url: req.body.resume_url,
        public_id: req.body.public_id,
      },
      SSC: req.body.SSC,
      SSC_year: req.body.SSC_year,
      HSC: req.body.HSC,
      HSC_year: req.body.HSC_year,
      UG_course_name: req.body.UG_course_name,
      UG_university: req.body.UG_university,
      UG_institute_name: req.body.UG_institute_name,
      UG_passing_year: req.body.UG_passing_year,
      UG_percentage: req.body.UG_percentage,
      PG_course_name: req.body.PG_course_name,
      PG_university: req.body.PG_university,
      PG_institute_name: req.body.PG_institute_name,
      PG_passing_year: req.body.PG_passing_year,
      PG_percentage: req.body.PG_percentage,
    },
    (err,success)=>{
        if(err){
            res.json(err);
        } else {
            res.json(success);
        }
    }
  );
});

// routes for candidate profile - END

// routes for getting list of applied jobs - START
router.get('/:candidate_id/applied-jobs',(req,res)=>{
    let applied_jobs_id;

    candidate.findOne({_id:req.params.candidate_id},(err,foundCandidate)=>{
        if(err){
            res.json(err);
        } else{
            applied_jobs_id = foundCandidate.applied_jobs;
        }
    })

    jobs.find({'_id':{$in:applied_jobs_id}},(err,success)=>{
      if(err){
        res.json(err);
      } else{
        res.json(success);
      }
    })
})

router.get('/review-application/:candidate_id',(req,res)=>{
  candidate.findOne({_id:req.params.candidate_id},(err,success)=>{
    if(err){
      res.json(err);
    } else{
      res.json(success);
    }
  })
})
// routes for getting list of applied jobs - END

// routes for feedback - START
router.get('/feedback/:feedback_id',(req,res)=>{
  feedback.findOne({_id:req.params.feedback_id},(err,success)=>{
    if(err){
      res.json(err);
    } else{
      res.json(success);
    }
  })
})
// routes for feedback - START

module.exports = router;
