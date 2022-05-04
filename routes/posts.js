const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// Create a post 
router.post("/", async (req, res) => {
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
router.put("/:id", async (req, res) => {
    try {
        // I'll verify user again to do that I'll find this post
        const post = await Post.findById(req.params.id) // this id --> [router.put("/:id"]
        // We're gonna check the owner of this post.
        if (post.userId === req.body.userId) {
            // if it's the same we can update this.
            await post.updateOne({ $set: req.body })
            res.status(200).json("The post has been updated.")
        } else {
            // if it's not I'll just turn some error.
            res.status(403).json("You can update only your post");
        }
    } catch (error) {
        // even if there is no post like this it's gonna turn 500
        res.status(500).json(error)
    }
})


// Delete a post 
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("The post has been deleted.")
        } else {
            res.status(403).json("You can delete only your post");
        }
    } catch (error) {
        res.status(500).json(error)
    }
})


// Like / dislike a post 
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post has been liked.")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been DISLIKED.")
        }
    } catch (error) {
        res.status(500).json(error);
    }
})


// Get a post -- 
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})


// Get timeline post // all following's posts
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id }); // because in the post model we have userId here.
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;