const router = require("express").Router();
const Post = require("../models/Post");

// Create a post 
router.post("/", async(req,res)=> {
    const newPost = new Post(req.body)
    try {
        // I'm gonna create new one, so
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error)
    }
})

// Update a post 
// Delete a post 
// Like a post 
// Get a post 
// Get timeline post // all following's posts

module.exports = router;