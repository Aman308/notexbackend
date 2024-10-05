const express = require('express');
const router = express.Router()
const User = require ('../models/User');
const {body , validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Amanisawebdev$6969'

// ROUTE:1 Create a user using: POST "/api/auth/createuser".  NO login reuired
router.post('/createuser',[
    body('name' , 'Enter a valid name').isLength({min: 3}),
    body('email','Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 character').isLength({min: 5})
], async (req,res)=>{
    let success = false;
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        // Check wether the user with this email already exist
        
   
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error: "Sorry a user is already exists with this email"})
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password , salt)
    // Create new User
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
    })
    const data = {
        user:{
            id: user.id
        }
        
    }
    const authToken =  jwt.sign(data, JWT_SECRET);
    // res.json(user)
    success = true;
    res.json({success ,authToken})
} catch (error) {
      console.error(error.message);  
      res.status(500).send("Internal server Error")
}
})



// ROUTE:2 Authenticate a user using: POST "/api/auth/login".  NO login reuired
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password can not be blanck').exists(),
], async (req,res)=>{
    let success = false;
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email ,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            success = false;
            return res.status(400).json({success ,error: "Please try again with correct credentials"})
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false;
            return res.status(400).json({success , error: "Please try again with correct credentials"})
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken =  jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success ,authToken});

    } catch (error) {
        console.error(error.message);  
        res.status(500).send("Internal server Error");
    }

})

// ROUTE:3 Get loggedin User Details using: POST "/api/auth/getuser".  login reuired
router.post('/getuser', fetchuser, async (req,res)=>{
try {
   userId = req.user;
    const user = await User.findOne({userId}).select("-password")
    res.send(user)
} catch (error) {
    console.error(error.message);  
    res.status(500).send("Internal server Error");
}
})

module.exports = router