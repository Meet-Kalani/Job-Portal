const jobs = require("../models/jobs");
const candidate = require("../models/candidate");
const feedback = require("../models/feedback");
const employer = require("../models/employer");
const auth = require("../middleware/auth");
const chatroom = require("../models/chatroom");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cloudinary = require('cloudinary');
const nodemailer = require('nodemailer');
router.use(cors());

cloudinary.config({
  cloud_name: "meetkalani",
  api_key: "614945554319442",
  api_secret: "u_nX1qZs6QQzC9Uq5Kc4OS6JI-4"
});

router.post("/signup", (req, res) => {
  try {
    // Checking if user Exists
    candidate.findOne({ mail: req.body.mail }, (err, success) => {
      if (err) {
        throw err;
      } else {
        if (success === null) {
          // Hashing password to store in db
          bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            // creating user and saving it
            candidate.create(
              {
                name: req.body.name,
                mail: req.body.mail,
                password: hash,
              },
              (err, success) => {
                if (err) {
                  res.json(err);
                } else {
                  console.log("New user signed up");
                  console.log("---------------------------------------------");
                  console.log("User Name: " + success.name);
                  console.log("User Mail: " + success.mail);
                  console.log("---------------------------------------------");
                  console.log("");
                  // Sending response to client
                  res.json({
                    success: true,
                    message: "New user created!",
                    name: success.name,
                  });
                }
              }
            );
          });
        }
      }
    });
  } catch (err) {
    res.json(err);
  }
});

router.post("/login", (req, res) => {
  try {
    // Finding user for verifying credentials
    candidate.find({ mail: req.body.mail }, (err, success) => {
      if (err || success.length == 0) {
        res.json({
          success: false,
          message: "Invalid Credentials!",
        });
      } else {
        const tokenCredentials = {
          userID: success[0]._id,
          name: success[0].name,
          mail: success[0].mail,
        };
        let token = jwt.sign(
          { credentials: tokenCredentials },
          "JustTheTwoOfUs"
        );
        bcrypt.compare(
          req.body.password,
          success[0].password,
          function (err, result) {
            console.log("Logged In : " + result);
            if (result == true) {
              console.log("---------------------------------------------");
              console.log("Logged In User Name: " + success[0].name);
              console.log("Logged In User Mail: " + success[0].mail);
              console.log("---------------------------------------------");

              // Sending response to client
              res.json({
                success: true,
                message: "Authentication successful!",
                name: success[0].name,
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

router.get("/jobs/search/:tagName", (req, res) => {
  var searchKey = new RegExp(req.params.tagName, 'i')

  jobs.find({ tags: searchKey}, (err, success) => {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log(success);
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

// routes for contact - START
router.post("/contact",async(req,res)=>{
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'laap6bauflvwbw5m@ethereal.email',
        pass: '1fKsgpJFe6Py2UYnfn'
    }
});

  let info = await transporter.sendMail({
    from: req.body.mail,
    to: "meetkalani2002@gmail.com",
    subject: req.body.name,
    text: req.body.message
  });

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.json({'preview link':nodemailer.getTestMessageUrl(info)});
})
// routes for contact - END

// router.delete('/:candidate_id',auth,(req,res)=>{
//   candidate.findOneAndDelete({_id:req.params.candidate_id},(err,success)=>{
//     if(err){
//       res.json(err)
//     } else{
//       console.log(success);
//       res.json(success);
//     }
//   })
// })

// routes for candidate profile - START
router.get("/profile", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, "JustTheTwoOfUs");

  candidate.findOne({ _id: decoded.credentials.userID }, (err, success) => {
    if (err) {
      res.json(err);
    } else {
      res.json(success);
    }
  });
});

router.get("/profile/:profile_id", (req, res) => {
  candidate.findOne({ _id: req.params.profile_id }, (err, success) => {
    if (err) {
      res.json(err);
    } else {
      res.json(success);
    }
  });
});

router.put("/profile/:candidate_id/edit", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, "JustTheTwoOfUs");

  let delimetedSkills = req.body.skills.trim().split(/\s+/);

  let data = {
    name: req.body.name,
    bio: req.body.bio,
    profile_picture: req.body.profile_picture,
    place: req.body.place,
    contact: req.body.contact,
    skills: delimetedSkills,
    age: req.body.age,
    resume: req.body.resume,
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
  };

  console.log(req.body.profile_picture)
  // console.log(data)

  candidate.findOneAndUpdate(
    { _id: req.params.candidate_id },
    data,
    (err, success) => {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        // console.log(success);
        // cloudinary.uploader.destroy(success.profile_picture.public_id);
        // cloudinary.uploader.destroy(success.resume.public_id);
        res.json(success);
      }
    }
  );
});
// routes for candidate profile - END

// routes for actually appling in jobs - START
router.get("/:job_id/apply", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, "JustTheTwoOfUs");

  jobs.findOneAndUpdate(
    { _id: req.params.job_id },
    { $push: { candidate_id: decoded.credentials.userID } },
    (err, modifiedJob) => {
      if (err) {
        // res.json(err);
        console.log(err);
      } else {
        console.log(modifiedJob);
        candidate.findOneAndUpdate(
          { _id: decoded.credentials.userID },
          { $push: { applied_jobs: req.params.job_id } },
          (err, modifiedCandidate) => {
            if (err) {
              // res.json(err);
              console.log(err);
            } else {
              console.log(modifiedCandidate);
              res.json({
                success: true,
                message: "Successfully Applied for Job!",
              });
            }
          }
        );
      }
    }
  );
});
// routes for actually appling in jobs - END

// routes for getting list of applied jobs - START
router.get("/applied-jobs", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, "JustTheTwoOfUs");

  candidate.findOne(
    { _id: decoded.credentials.userID },
    (err, foundCandidate) => {
      if (err) {
        res.json(err);
      } else {
        jobs.find(
          { _id: { $in: foundCandidate.applied_jobs } },
          (err, success) => {
            if (err) {
              res.json(err);
            } else {
              res.json(success);
              console.log(success);
            }
          }
        );
      }
    }
  );
});

router.get("/review-application", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, "JustTheTwoOfUs");

  candidate.findOne({ _id: decoded.credentials.userID }, (err, success) => {
    if (err) {
      res.json(err);
    } else {
      res.json(success);
    }
  });
});
// routes for getting list of applied jobs - END

// routes for feedback - START
router.get("/feedback/:job_id/:candidate_id", auth, async (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, "JustTheTwoOfUs");

  let candidateData = await candidate.findById({
    _id: req.params.candidate_id,
  });

  // res.json(candidate)
});
// routes for feedback - START

// Chatroom -START
router.get("/create-chatroom/:job_id", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, "JustTheTwoOfUs");

  chatroom.create(
    {
      candidate_id: decoded.credentials.userID,
      job_id: req.params.job_id,
    },
    (err, success) => {
      if (err) {
        res.json(err);
      } else {
        candidate.findOneAndUpdate(
          { _id: decoded.credentials.userID },
          { $push: { chatroom_id: success._id } },
          (err, modifiedCandidate) => {
            if (err) {
              res.json(err);
              console.log(err);
            } else {
              console.log(modifiedCandidate);
              res.json({
                success: true,
                message: "Successfully Created Chatroom!",
              });
            }
          }
        );
      }
    }
  );
});

router.get("/chatroom/:candidate_id", auth, (req, res) => {
  // Verifying Access Token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  let decoded = jwt.verify(token, "JustTheTwoOfUs");

  chatroom.find(
    { candidate_id: decoded.credentials.userID },
    (err, success) => {
      if (err) {
        res.json(err);
      } else {
        res.json(success);
      }
    }
  );
});
// Chatroom - END

module.exports = router;
