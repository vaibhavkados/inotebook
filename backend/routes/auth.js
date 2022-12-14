const express = require('express');
const User = require('../models/User')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser")

const JWT_SECRETE = 'vaibhav$kados'

//Route1 : Create a User using: POST "/api/auth/createuser". Dosen't require Auth



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
          const secPass = await bcrypt.hash(req.body.password, salt)
          // Create a new User
          user = await User.create({
               name: req.body.name,
               password: secPass,
               email: req.body.email
          })

          const data = {
               user: {
                    id: user.id
               }
          }

          const authtoken = jwt.sign(data, JWT_SECRETE);

          res.json({ authtoken })
          // Catch errors
     } catch (error) {
          console.log(error.message)
          res.status(500).send("Internal Server Error")
     }



})

//Route2 : Create a User using: POST "/api/auth/login". Dosen't require Auth

router.post('/login', [
     body('email', 'Enter a Valid Email').isEmail(),
     body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
     // If there are errors return bad request and Errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
     }

     const { email, password } = req.body;

     try {
          let user = await User.findOne({ email });
          if (!user) {
               return res.status(400).json({ error: "Please try to login with correct credentials" });
          }

          const passwordCompare = await bcrypt.compare(password, user.password)

          if (!passwordCompare) {
               return res.status(400).json({ error: "Please try to login with correct credentials" });
          }
          const data = {
               user: {
                    id: user.id
               }
          }

          const authtoken = jwt.sign(data, JWT_SECRETE);
          res.json({ authtoken })
     } catch (error) {
          console.log(error.message)
          res.status(500).send("Internal Server Error")
     }
})

//Route3 : Get loggedin User using: POST "/api/auth/createuser". Dosen't require Auth
router.post('/getuser', fetchuser, async (req, res) => {
     try {
          userId = req.user.id
          const user = await User.findById(userId).select("-password")
          res.send(user)
     } catch (error) {
          console.log(error.message)
          res.status(500).send("Internal Server Error")
     }
})

module.exports = router