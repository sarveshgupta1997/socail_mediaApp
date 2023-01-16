const express = require("express");
const mongoose =require("mongoose")
const {PostModel} = require("../models/post_model");

const postRoute= express.Router();

postRoute.get("/", async(req,res)=>{
   try {
        let userId=req.body.userId;
        let device=req.query.device;
        let device1=req.query.device1;
        let device2=req.query.device2;
        if(device){
            let posts = await PostModel.find({userId:userId,device});
            res.send(posts);
        }
        else if(device1 && device2){
            console.log(device1,device2)
            let posts1 = await PostModel.find({userId:userId,device1});
            let posts2 = await PostModel.find({userId:userId,device2});
            let posts = [...posts1,...posts2];
            res.send(posts);
        }else{
            let posts = await PostModel.find({userId:userId});
            res.send(posts);
        }
   } catch (error) {
        res.send({err:error.message});
   }
})

// Post Create
postRoute.post("/create",async (req,res)=>{
    try {

        let payload=req.body;
        let post = new PostModel(payload);
        await post.save();
        res.send({msg:"Post Added"});
    } catch (error) {
        res.send({err:"Error while creating post"});
        console.log({err:error.message})
    }
})

// Post Update
postRoute.patch("/update/:id",async (req,res)=>{
    try {
        let payload=req.body;
        let postId=req.params.id;
        let note = await PostModel.findOne({_id:postId});
        if(note.userId==payload.userId){
            await PostModel.findByIdAndUpdate({_id:postId},payload);
            res.send({msg:"Post Updated"});
        }else{
            res.send({err:"You are not allowed to edit someone else's post"});
        }
    } catch (error) {
        res.send({err:"Error while creating post"});
    }
})

// Post Delete
postRoute.delete("/delete/:id",async (req,res)=>{
    try {
        let payload=req.body;
        let postId=req.params.id;
        let note = await PostModel.findOne({_id:postId});
        if(note.userId==payload.userId){
            await PostModel.findByIdAndDelete({_id:postId});
            res.send({msg:"Post Deleted"});
        }else{
            res.send({err:"You are not allowed to delete someone else's post"});
        }
    } catch (error) {
        res.send({err:"Error while creating post"});
    }
})


module.exports={postRoute};