const express = require("express")
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology:true },
    () => {
        console.log("Connected to MONGODB");
    })

//middleware
app.use(express.json()); // body parser when you make  post request.. İt just gonna password it
app.use(helmet());
app.use(morgan("common"));

app.get("/", (req,res)=>{
    res.send("Welcome to homepage")
})

app.get("/users", (req,res)=>{
    res.send("Welcome to user page")
})

app.listen(8800, () => {
    console.log("Backend server is running!");
})