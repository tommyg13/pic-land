"use strict";
const express       = require("express"),
      router        = express.Router(), 
      Image         = require("../models/image"),
      User          = require("../models/user"),
      ObjectID = require('mongodb').ObjectID;

router.get("/profile/:id",(req,res)=>{
    let auth;
    if(req.user===undefined || req.user._id.toString() !== req.params.id){
        
    let query={"user":req.params.id};
    Image.find(query).then((data)=>{
        if( req.user===undefined){
    res.render("profile",{title:"Profile",auth,images:data});
        }
        else {
        data.map(doc=>{
           doc.likedBy.map(liked=>{
              if(liked.toString()===req.user._id.toString()){
                  doc.likeClass=true;
                  doc.save();                  
              } 
              else {
                  doc.likeClass=false;
                  doc.save();
              }
           }); 
        });
    User.findById(req.params.id).then(user=>{
        let name=user.twitter.username || user.local.username;
       auth=false;
       res.render("profile",{title:name,auth,images:data,csrfToken: req.csrfToken()});           
    });
        }
    });
}
   else{
    let query={"user":req.user._id};
    auth=true;
    Image.find(query).then((match)=>{
                if( req.user===undefined){
    res.render("profile",{title:"Profile",auth,images:match});
        }
        else {
        match.map(doc=>{
           doc.likedBy.map(liked=>{
              if(liked.toString()===req.user._id.toString()){
                  doc.likeClass=true;
                  doc.save();                  
              } 
              else {
                  doc.likeClass=false;
                  doc.save();
              }
           }); 
        });
        let name=req.user.twitter.username || req.user.local.username;
        let url=req.params.id;
    res.render("profile",{title:name,url,auth,images:match,csrfToken: req.csrfToken()});   
        }
    });

    }
    
});

router.post("/add_image",isLoggedIn,(req,res)=>{
    let avatar=req.user.local.image || req.user.twitter.image;
    let category=req.body.category;
    let url=req.body.imageURL;
    let regex=/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
    
    if(url.match(regex)) {
        url=req.body.imageURL;
    }
    else {
        url="https://res.cloudinary.com/dlvavuuqe/image/upload/v1492273823/image-not-found_im8zkq.jpg";
    }
    
    let item={
        description :req.body.imageDesc,
        url,
        user        :req.user._id,
        category,
        likeClass   :false,
        userAvatar  :avatar
};
 let data = new Image(item);
    data.save();

    let id=req.user._id;
res.redirect("/profile/"+id);
});

router.get("/remove/:id",(req,res)=>{
    let id=req.params.id;
   Image.findById(id,(err,img)=>{
       if(err) console.log(err);
      else {
          if(req.user._id.toString() !== img.user.toString()){
              res.send("not found");
          }
          else {
    Image.findByIdAndRemove(id).exec();
    let userId=req.user._id;
   res.redirect("/profile/"+userId);
          }
      }
   });
});

router.get("/image/:id",isLoggedIn,(req,res)=>{
    let id=req.params.id;
    let helper=true;
    Image.findById(id).then(match=>{
        
        match.likedBy.map(voter=>{
           if(voter.toString()===req.user._id.toString()){
         Image.update({_id: id,}, 
              {$pull: {'likedBy': req.user._id}},(err)=>{
                if(err)console.log(err);
       });        
             helper=false;
               match.likeClass=false;
               match.save();
           }
        });
       if(helper===true){
           match.likeClass=true;
           match.save();
         Image.update({_id: id,}, 
              {$push: {'likedBy': req.user._id}},(err)=>{
                if(err)console.log(err);
       }); 
        User.findById(req.user._id)
        .then(user=>{
            if(match.user.toString() !== req.user.id.toString()){

           let name=user.local.username || user.twitter.username;
           let logo=user.local.image || user.twitter.image;
           let imageId=id;
           let notId=new ObjectID();
           let notf=name+ " liked your image";
           let message={name,imageId,logo,notId,notf};
           User.update({_id:match.user},{$push:{"local.notifications":message}},(err)=>{
        if(err)console.log(err);
    });
            }
        });
       }
    });
     
      res.redirect("back");
});

router.get("/show/image/:id",isLoggedIn,(req,res)=>{
    let query=req.params.id;
    let userId=[];
    let userName=[];
    let name;
    Image.findById(query)
    .then((image=>{
    
        image.likedBy.map(match=>{
        if(match.toString()===req.user._id.toString()){
            image.likeClass=true;
            image.save();
        }
        else{
            image.likeClass=false;
            image.save();          
        }
           userId.push(match);
        });
        User.find({_id:userId}).then(users=>{
           users.map((user)=>{
             name=user.twitter.username || user.local.username;
             userName.push(name);
           });
    image.comments.map(doc=>{
       if(doc.userId.toString()===req.user._id.toString() || image.user === req.user._id.toString()){
       doc.auth=true;
       } 
       else {
      doc.auth=false;
       }
    });
    Image.find({category:image.category})
    .then(similar=>{
        let index = similar.findIndex(x => {
           return x._id.toString()==image._id.toString()});
        similar.splice(index, 1);
      res.render("image",{image,userName,similar,csrfToken: req.csrfToken()}); 
    });
        });
    }));
});

router.post("/show/image/:id",isLoggedIn,(req,res)=>{
    if(req.body.comment===""){
        req.flash("error","Field cannot be empty");
    }
    else {
     let comment;
     let username;
     let avatar;
     let auth=false;
User.findById(req.user._id).then(user=>{

   avatar=user.twitter.image || user.local.image;

   let id=new ObjectID();
    username=req.user.twitter.username || req.user.local.username;
    comment={id,comment:req.body.comment,userName:username,userId:req.user._id,avatar,auth};

         Image.update({_id: req.params.id,}, 
              {$push: {'comments': comment}},(err)=>{
                if(err)console.log(err);
       });
        Image.findById(req.params.id).then(image=>{
           if(req.user._id.toString() !== image.user.toString()){ 
           let name=user.local.username || user.twitter.username;
           let logo=user.local.image || user.twitter.image;
           let imageId=req.params.id;
           let notId=id;
           let notf=name+ " commented on your image";
           let message={name,imageId,logo,notId,notf};
           User.update({_id:image.user},{$push:{"local.notifications":message}},(err)=>{
        if(err)console.log(err);
    });
           }   
        });
});
    }
   res.redirect("back");
});

router.get("/categories/:name",(req,res)=>{
    let name=req.params.name;
    let query={category:name};
     Image.find(query).then((match)=>{
         if(req.user===undefined) {
     let name1= name.replace(/_/g, ' ');
    res.render("categories",{title: name1,name1,images:match});               
         }
else {
        match.map(doc=>{
           doc.likedBy.map(liked=>{
              if(liked.toString()===req.user._id.toString()){
                  doc.likeClass=true;
                  doc.save();                  
              } 
              else {
                  doc.likeClass=false;
                  doc.save();
              }
           }); 
        });         
    let name1= name.replace(/_/g, ' ');
    res.render("categories",{title: name1,name1,images:match}); 
}
    });
});

router.get("/delete/:id",(req,res)=>{
    let userName=req.user.twitter.username || req.user.local.username;
   let query= {comments: {$elemMatch: {userName}}};
    Image.find(query).then(d=>{
       d.map(coms=>{
          coms.comments.map(comment=>{
           if(comment.id.toString()===req.params.id.toString()){
            Image.update(
                   { },
    { $pull: { comments: { $in: [ comment ] }} },(err)=>{
       if(err)console.log(err);
    });
           }
          });
       });
    });
   res.redirect("back"); 
});

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
   req.flash("error","Please sign in or register to view this page.");
    res.redirect('/auth');
}

module.exports = router;