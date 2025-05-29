const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Chat = require('../models/Query');
router.get('/fetchallqueries', fetchuser, async (req, res) => {
    try{
        const query = await Chat.find({user: req.user.id});
        res.json(query);
    }
    catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
router.post('/postquery', fetchuser, async(req, res) => {
    try{
        const {query, answer} = req.body;
        const prompt = new Chat({
            user: req.user.id,
            messages: [{query, answer}]
        });
        const savedPrompt = await prompt.save();
        res.json(savedPrompt);
    }
    catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
router.put('/updatequery/:id', fetchuser, async(req, res) => {
    const {query, answer} = req.body;
    try{
        const message = {};
        if(query){
            message.query = query;
        }
        if(answer){
            message.answer = answer;
        }
        let prompt = await Chat.findById(req.params.id);
        if(!prompt){
            return res.status(404).send("Not found");
        }
        if(prompt.user.toString() !== req.user.id){
            return res.status(401).send("Access denied");
        }
        prompt = await Chat.findByIdAndUpdate(req.params.id, {$push: {messages: { query, answer}}}, {new: true});
        res.json(prompt);
    }
    catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;