const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {connection} = require("./config/db")
const {userRoute} = require("./routes/user_route")
const {postRoute} = require("./routes/post_route")
const {authenticator} = require("./middlewares/authentication")

const app= express();
app.use(express.json());
app.use(cors());
app.use("/users",userRoute);
app.use(authenticator);
app.use("/posts",postRoute);

app.get("/",(req,res)=>{
    res.send({msg:"homepage"})
})

app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("Connected to db")
    } catch (error) {
        console.log({err:error.message})
    }
    console.log("server running at port 4400")
})

