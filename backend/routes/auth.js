const express = require('express');
const User = require('../models/User')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


const JWT_SECRETE = 'vaibhav$kados'

//Create a User using: POST "/api/auth/createuser". Dosen't require Auth



router.post('/createuser', [
     body('name', 'Enter a Valid Name').isLength({ min: 3 }),
     body('email', 'Enter a Valid Email').isEmail(),
     body('password', 'Password Must be at Least 5 Characters').isLength({ min: 5 }),
], async (req, res) => {

     // If there are errors return bad request and Errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
     }

     // Whether user with this email Exists already
     try {
          let user = await User.findOne({ email: req.body.email });
          if (user) {
               return res.status(400).json({ error: "Sorry a user with this email already exists" })
          }

          const salt = await bcrypt.genSalt(10)
          const secPass = await bcrypt.hash(req.body.password,salt) 
          // Create a new User
          user = await User.create({
               name: req.body.name,
               password: secPass,
               email: req.body.email
          })

          const data = {
               user : {
                    id : user.id
               }
          }

          const authtoken = jwt.sign(data,JWT_SECRETE);

          res.json({authtoken})
          // Catch errors
     } catch (error) {
          console.log(error.message)
          res.status(500).send("Some Error occured")
     }



})

module.exports = router