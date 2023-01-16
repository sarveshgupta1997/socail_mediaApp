const express = require("express");
const mongoose =require("mongoose")
const {UserModel} = require("../models/user_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userRoute= express.Router();

userRoute.get("/",(req,res)=>{
    res.send({msg:"User"})
})

// User Register
userRoute.post("/register",async (req,res)=>{
    try {
        let {name,email,gender,password}=req.body;
        let salt = +process.env.salt;
        bcrypt.hash(password,salt,async(err,sec_pass)=>{
            if(err){
                console.log("err")
            }else{
                let user = new UserModel({name,email,gender,password:sec_pass});
                await user.save();
                res.send({msg:"User Added"});
            }
        })
    } catch (error) {
        res.send({err:"Error while registering user"});
        console.log({err:error.message})
    }
})

// User Login
userRoute.post("/login",async (req,res)=>{
    try {
        let {email,password}=req.body;
        let user = await UserModel.find({email});
        if(user.length>0){
            bcrypt.compare(password,user[0].password,async(err,result)=>{
                if(result){
                    let token = jwt.sign({userId:user[0]._id},process.env.seceretKey);
                    res.send({msg:"User Logged in",token:token})
                }else{
                    res.send({err:"Wrong Credentials"});
                }
            })
        }else{
            res.send({err:"Wrong Credentials"})
        }
        
    } catch (error) {
        res.send({err:"Error while logging in user"});
        console.log({err:error.message})
    }
})


module.exports={userRoute};