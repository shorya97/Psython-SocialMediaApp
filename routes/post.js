const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post= mongoose.model('Post')

//Create Post
router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,picture} = req.body
    if(!title || !body || !picture){
        return res.status(422).json({error:"Kindly fill all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:picture,
        uploadedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

//Show all Posts
router.get('/allposts',requireLogin,(req,res)=>{
    Post.find()
        .populate("uploadedBy","_id name")
        .populate("comments.uploadedBy","_id name")
        .then(posts=>{
            res.json({posts})
        })
        .catch(err=>{
            console.log(err)
        })
})

//Show private Posts
router.get('/getpvtpost',requireLogin,(req,res)=>{
    Post.find({uploadedBy:{$in:req.user.following}})
        .populate("uploadedBy","_id name")
        .populate("comments.uploadedBy","_id name")
        .then(posts=>{
            res.json({posts})
        })
        .catch(err=>{
            console.log(err)
        })
})


//Posts by current user
router.get('/myposts',requireLogin,(req,res)=>{
    Post.find({uploadedBy:req.user._id})
        .populate("uploadedBy","_id name")
        .then(mypost=>{
            res.json({mypost})
        })
        .catch(err=>{
            console.log(err)
        })
})

//Like by a user
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.uploadedBy","_id name")
    .populate("uploadedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
    
})

//Unlike by a user
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.uploadedBy","_id name")
    .populate("uploadedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
    
})

//Comment by a user
router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text: req.body.text,
        uploadedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.uploadedBy","_id name")
    .populate("uploadedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

//Delete a post
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.uploadedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})


module.exports = router