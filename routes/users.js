const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")

// Update User
router.put("/:id", async (req, res) => {
    // firstly I'm gonna verify if the user id doesn't match with this id. We are gonna return some error
    // when we send this request we're going to write to POSTMAN userID. And we'll try to match with this ID. 
    // If they match it means it's the same user. Otherwise the user can't update or delete  any other user's account.

    // req.params.id --> bunun anlamı hemen üstteki router.put("/:id",) --> buradaki |"/:id"| bu değer
    if (req.body.userId === req.params.id || req.user.isAdmin) {
        // if user try to update password
        if (req.body.password) { // we send some password inside this body in postman
            try {
                const salt = await bcrypt.genSalt(10); // we'are gonna generate new password
                req.body.password = await bcrypt.hash(req.body.password, salt) // and we'll update this request body and password
            } catch (error) {
                return res.status(500).json(error)
            }
        }
        // okey we completed this password and after that I'll update my actual user.
        try {
            // req.params.id --> Bunun yerine "req.body.userId" bunu da yazabilirdik.Farketmez
            const user = await User.findByIdAndUpdate(req.params.id, { 
                $set: req.body }) // it's gonna automatically set all inputs inside this body
                res.status(200).json("Account has been updated") // 200 --> succesfull
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json("You can update only your account!")
    }
})
// Delete User
// Get a  User
// Follow a User
// Unfollow a User




module.exports = router