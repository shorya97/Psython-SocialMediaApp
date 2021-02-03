const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post= mongoose.model('Post')
const User= mongoose.model('User')

//Profile 
router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({uploadedBy:req.params.id})
            .populate("uploadedBy","_id name")
            .exec((err,posts)=>{
                if(err){
                    return res.status(422).json({error:err})
                }
                res.json({user,posts})
            })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})


//Follow a user
router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followId}
          
      },{new:true})
        .select("-password")
        .then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})

//Unfollow a user
router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.unfollowId}
          
      },{new:true})
        .select("-password")
        .then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})

//Update picture
router.put("/updatepic",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:"Cannot post the picture"})
            }
            res.json(result)
        })
})


//Search users
router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp('^' + req.body.query, 'i')
    User.find({name:{$regex:userPattern}})
        .select("_id name email")
        .then(user=>{
            res.json({user})
        }).catch(err=>{
            console.log(err)
        })
})


module.exports = router