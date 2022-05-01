const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")

// Update User
router.put("/:id", async (req, res) => {

    if (req.body.userId === req.params.id || req.body.isAdmin) {

        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.status(500).json(error)
            }
        }

        try {

            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json("Account has been updated")
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json("You can update only your account!")
    }
})

// Delete User
router.delete("/:id", async (req, res) => {

    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted")
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json("You can delete only your account!")
    }
})


// Get a  User
router.get("/:id", async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        const {password,updatedAt, createdAt, ...other} = user._doc;
        res.status(200).json(other); // 200 --> successfull
    } catch (error) {
       res.status(500).json(error); 
    }
})

// Follow a User
router.put("/:id/follow", async (req,res)=> {
    if(req.body.userId !== req.params.id){ // same user
        try {
            const user = await User.findById(req.params.id) 
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{followings:req.params.id}})
                res.send(200).json("User has been followed")
            }else{
                res.status(403).json("You already follow this user.")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You can't follow yourself.")
    }
})

// Unfollow a User




module.exports = router