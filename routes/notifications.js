"use strict";
const express       = require("express"),
      router        = express.Router(), 
      User          = require("../models/user");
      
router.get("/clear",(req,res)=>{

    User.update( { _id: req.user._id },{ $set : {'local.notifications': [] }} , {multi:true},(err)=>{
        if(err)console.log(err);
    });
    
    res.redirect("back");
});

router.get("/clear/:id",(req,res)=>{
     User.findById(req.user._id).then(user=>{
        user.local.notifications.map(notf=>{
           if(notf.notId.toString()===req.params.id.toString()) {
      User.update( { _id: req.user._id },{ $pull : {'local.notifications': notf }} , {multi:true},(err)=>{
        if(err)console.log(err);
    });
           }
        });

     });
    res.redirect("back");
});

module.exports=router;