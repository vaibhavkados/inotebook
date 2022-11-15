const express = require('express');
const User = require('../models/User')
const router = express.Router();

//Create a User using: POST "/api/auth". Dosen't require Auth

router.post('/',(req,res)=>{
     
     console.log(req.body);
     const user = User(req.body);
     user.save().then(()=>{
          console.log("User Saved")
     })
     res.send(req.body)
})

module.exports = router