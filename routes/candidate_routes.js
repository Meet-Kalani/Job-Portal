const express = require('express');
const router = express.Router();

router.get('/',(req,res)=> {
    res.send("You got the response from backend of candidate page")
})

module.exports = router;
