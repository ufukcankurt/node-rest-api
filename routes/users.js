const router = require("express").Router();

router.get("/", (req,res)=> {
    res.send("hey its USER route.")
})

module.exports = router