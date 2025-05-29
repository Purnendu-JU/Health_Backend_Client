require('dotenv').config();
const {body, validationResult} = require('express-validator');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
var fetchuser = require('../middleware/fetchuser');
router.post('/signup', [
    body('name', 'Name must be atleast 3 characters long').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 3 characters long').isLength({min: 3})
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({error: 'Already exists'});
        }
        const salt = await bcrypt.genSalt(10);
        const SecPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: SecPass,
            email: req.body.email
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})
router.post('/getuser', fetchuser, async(req, res) => {
    try{
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})
router.post('/', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please enter correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Enter correct details" });
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken, username: user.name });

    } 
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
});
module.exports = router;