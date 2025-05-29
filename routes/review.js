const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Review = require('../models/Review');
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); 
router.post('/contact', [
    body('message', 'Message must be at least 5 characters long').isLength({ min: 5 }),
    body('subject', 'Subject must be at least 3 characters long').isLength({ min: 3 }),
    body('phone', 'Phone must be 10 digits').optional().isLength({ min: 10, max: 10 }).isNumeric()
], fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, phone, subject, message } = req.body;

        const contact = new Review({
            name,
            email,
            phone,
            subject,
            msg: message 
        });

        await contact.save();
        res.status(201).json({ success: true, message: "Message sent" });
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
