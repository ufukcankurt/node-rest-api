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
router.put("/:id", async (req,res)=>{
    try {
        // I'll verify user again to do that I'll find this post
    const post = await Post.findById(req.params.id) // this id --> [router.put("/:id"]
    // We're gonna check the owner of this post.
    if(post.userId === req.body.userId){
        // if it's the same we can update this.
        await post.updateOne({$set:req.body})
        res.status(200).json("The post has been updated.")
    }else{
        // if it's not I'll just turn some error.
        res.status(403).json("You can update only your post");
    }
    } catch (error) {
        // even if there is no post like this it's gonna turn 500
        res.status(500).json(error)
    }
})


// Delete a post 
router.delete("/:id", async (req,res)=>{
    try {
    const post = await Post.findById(req.params.id)
    if(post.userId === req.body.userId){
        await post.deleteOne();
        res.status(200).json("The post has been deleted.")
    }else{
        res.status(403).json("You can delete only your post");
    }
    } catch (error) {
        res.status(500).json(error)
    }
})


// Like a post 
// Get a post 
// Get timeline post // all following's posts

module.exports = router;