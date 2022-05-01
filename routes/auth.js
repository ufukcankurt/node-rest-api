const router = require("express").Router();

router.get("/", (req,res)=> {
    res.send("hey its AUTH route.")
})

module.exports = router