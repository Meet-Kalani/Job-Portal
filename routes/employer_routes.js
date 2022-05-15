const employer = require("../models/employer");
const candidate = require("../models/candidate");
const feedback = require("../models/feedback");
const jobs = require("../models/jobs");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const cors = require("cors");
router.use(cors());

router.get("/my-listed-jobs", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

  employer.findOne({ _id: decoded.credentials.userID }, (err, foundEmployer) => {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      // console.log(foundEmployer.job_postings[0].toString());
      let data = [];
      foundEmployer.job_postings.map(job_id => data.push(job_id.toString()));
      // console.log(data)
      jobs.find(
        { _id: { $in: data } },
        (err, success) => {
          if (err) {
            console.log(err);
            res.json(err);
          } else {
            console.log(success);
            res.json(success);
          }
        }
      );
    }
  });
});

router.post("/signup", (req, res) => {
  console.log(req.body);
  try {
    // Checking if user Exists
    employer.findOne(
      { company_mail: req.body.company_mail },
      (err, success) => {
        if (err) {
          console.log(err);
          throw err;
        } else {
          if (!success) {
            // Hashing password to store in db
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
              // creating user and saving it
              let data = {
                company_name: req.body.name,
                company_mail: req.body.mail,
                company_bio: req.body.company_bio,
                company_profile_picture: req.body.company_profile_picture,
                contact: req.body.contact,
                address: req.body.address,
                password: hash,
              };
              employer.create(data, (err, success) => {
                if (err) {
                  console.log(err);
                  res.json(err);
                } else {
                  console.log('in'+success);
                  console.log("New user signed up");
                  console.log("---------------------------------------------");
                  console.log("User Name: " + success.company_name);
                  console.log("User Mail: " + success.company_mail);
                  console.log("---------------------------------------------");
                  console.log("");
                  // Sending response to client
                  res.json(success);
                }
              });
            });
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.post("/login", (req, res) => {
  try {
    // Finding user for verifying credentials
    employer.find({ company_mail: req.body.mail }, (err, success) => {
      if (err || success.length == 0) {
        res.json({
          success: false,
          message: "Invalid Credentials!",
        });
      } else {
        const tokenCredentials = {
          userID: success[0]._id,
          company_name: success[0].company_name,
          company_mail: success[0].company_mail,
        };
        let token = jwt.sign(
          { credentials: tokenCredentials },
          config.get('jwtPrivateKey')
        );
        bcrypt.compare(
          req.body.password,
          success[0].password,
          function (err, result) {
            console.log("Logged In : " + result);
            if (result == true) {
              console.log("---------------------------------------------");
              console.log("Logged In User Name: " + success[0].company_name);
              console.log("Logged In User Mail: " + success[0].company_mail);
              console.log("---------------------------------------------");

              // Sending response to client
              res.json({
                success: true,
                message: "Authentication successful!",
                company_name: success[0].company_name,
                token: token,
              });
            } else {
              res.json({
                success: false,
                message: "Invalid Credentials!",
              });
            }
          }
        );
      }
    });
  } catch (err) {
    res.json(err);
  }
});

router.get("/:employer_id", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

  employer.findOne({ _id: req.params.employer_id }, (err, success) => {
    if (err) {
      res.json(err);
    } else {
      res.json(success);
    }
  });
});

// routes for my listed jobs - START


// router.get("/jobs",auth,(req,res)=>{
//     console.log('ok')
//     // Verifying Access Token
//   try{
//     let token = req.headers["x-access-token"] || req.headers["authorization"];
//     let decoded = jwt.verify(token, config.get('jwtPrivateKey'));
  
//     jobs.find({ _id :decoded.credentials.userID},(err,success)=>{
//         if(err){
//             res.json(err);
//         } else{
//             res.json(success);
//             console.log(success)
//         }
//     })
//   } catch(ex){
//       console.log(ex);
//   }
// })

router.post("/jobs", auth, (req, res) => {
  console.log(req.body);
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

  // Breaking down tags to separate them with "," (comma)
  delimetedTags = req.body.tags.trim().split(/\s+/);
  delimetedSkills = req.body.skills.trim().split(/\s+/);
  delimetedPerks = req.body.perks.trim().split(/\s+/);

  jobs.create(
    {
      title: req.body.title,
      description: req.body.description,
      designation: req.body.designation,
      vacancy: req.body.vacancy,
      pay: req.body.pay,
      experience: req.body.experience,
      location: req.body.location,
      tags: delimetedTags,
      skills: delimetedSkills,
      perks: delimetedPerks,
      description_about_designation: req.body.description_about_designation,
      qualifications: req.body.qualifications,
      status: req.body.status,
      company_id: decoded.credentials.userID,
      company_name: decoded.credentials.company_name,
    },
    (err, success) => {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        console.log(success);
        employer.findByIdAndUpdate(
          { _id: decoded.credentials.userID },
          { $push: { job_postings: success._id } },
          (err, successAgain) => {
            if (err) {
              console.log(err);
            } else {
              console.log(successAgain);
              res.json(successAgain);
            }
          }
        );
        // res.json(success);
      }
    }
  );
});

router.put("/jobs/:id", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

  // Breaking down tags to separate them with "," (comma)
  delimetedTags = req.body.tags.trim().split(/\s+/);
  delimetedSkills = req.body.skills.trim().split(/\s+/);
  delimetedPerks = req.body.perks.trim().split(/\s+/);

  console.log(delimetedSkills, delimetedPerks);

  jobs.findOneAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      description: req.body.description,
      designation: req.body.designation,
      vacancy: req.body.vacancy,
      pay: req.body.pay,
      experience: req.body.experience,
      location: req.body.location,
      tags: delimetedTags,
      skills: delimetedSkills,
      perks: delimetedPerks,
      description_about_designation: req.body.description_about_designation,
      qualifications: req.body.qualifications,
      status: req.body.status,
      company_id: req.body.company_id,
      feedback_id: req.body.feedback_id,
      candidate_id: req.body.candidate_id,
      company_name: req.body.company_name,
    },
    (err, success) => {
      if (err) {
        res.json(err);
      } else {
        console.log(success);
        res.json(success);
      }
    }
  );
});

router.delete("/:job_id", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

  jobs.deleteOne({ _id: req.params.job_id }, (err, success) => {
    if (err) {
      res.json(err);
    } else {
      res.json(success);
    }
  });
});
// routes for my listed jobs - END

// routes for getting list of candidates who are applied for jobs - START
router.get("/jobs/:job_id/candidates", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

  // let listOfCandidates = [];
  jobs.findOne({ _id: req.params.job_id }, (err, foundJob) => {
    if (err) {
      res.json(err);
    } else {
      candidate.findOne(
        { _id: { $in: foundJob.candidate_id } },
        (err, foundCandidate) => {
          if (err) {
            res.json(err);
          } else {
            // listOfCandidates.push(foundCandidate);
            console.log(foundCandidate);
            res.json(foundCandidate);
          }
        }
      );
    }
  });

  // res.json(listOfCandidates);
  // console.log(listOfCandidates);
});
// routes for getting list of candidates who are applied for jobs - END

// routes for candidate's data - START
router.get("/jobs/:job_id/candidates/:candidate_id", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

  candidate.findOne({ _id: req.params.candidate_id }, (err, success) => {
    if (err) {
      res.json(err);
    } else {
      res.json(success);
    }
  });
});
// routes for candidate's data - END

// routes for feedback - START
router.get("/feedback/:job_id/:candidate_id", auth, async (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, config.get('jwtPrivateKey'));

  let candidateData = await candidate.findById({
    _id: req.params.candidate_id,
  });

  //   let feedbackData = await feedback.findOne({
  //     "_id":{
  //         $elemMatch:{
  //             $eq =
  //         }
  //     }
  //   })
});
// routes for feedback - END

module.exports = router;

// {_id:{$in:candidateData.feedback}} embed the enitere doc
