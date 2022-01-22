const express = require('express');
const router = express.Router();

router.get('/',(req,res)=> {
    res.send("You got the response from backend of employee page")
})

module.exports = router;
