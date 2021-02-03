const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL} = require("../config/keys")

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

//Sign up Route
router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body;
    if (!email || !password || !name){
        return res.status(422).json({error:"Please fill all the fields"})
    }
    User.findOne({email:email})
        .then((savedUser)=>{
            if(savedUser){
                return res.status(422).json({error:"User already exists with this email"})
            }
            bcrypt.hash(password,12)
                .then(hashedpassword=>{
                    const user = new User({
                        email,
                        password:hashedpassword,
                        name,
                        pic
                    })
                    user.save()
                        .then(user=>{
                            transporter.sendMail({
                                to:user.email,
                                from:"shoryat71@gmail.com",
                                subject:"Signup success",
                                html:"<h1>Welcome to Psython</h1>"
                            })
                            res.json({message:"Account created"})
                        })
                        .catch(err=>{
                            console.log(err)
                        })
                })
        })
        .catch(err=>{
            console.log(err)
        })
})

//Sign in Route
router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Please add email or password"})
    }
    User.findOne({email:email})
        .then(savedUser=>{
            if(!savedUser){
                return res.status(422).json({error:"Invalid email or password"})
            }
            bcrypt.compare(password,savedUser.password)
                .then(didMatch=>{
                    if(didMatch){
                        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                        const {_id,name,email,followers,following,pic} = savedUser
                        res.json({token,user:{_id,name,email,followers,following,pic}})
                    }
                    else{
                        return res.status(422).json({error:"Invalid email or password"})
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
        })
})

//Reset Password
router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
            .then(user=>{
                if(!user){
                    return res.status(422).json({error:"User dosen't exist"})
                }
                user.resetToken = token
                user.expireToken = Date.now() + 36000000
                user.save().then((result)=>{
                    transporter.sendMail({
                        to:user.email,
                        from:"no-reply@psython.com",
                        subject:"Passowrd Reset",
                        html:`
                            <p>Reset your password</p>
                            <h5>Click <a href="${EMAIL}/reset/${token}">here</a> to reset password</h5>
                        `
                    })
                    res.json({message:"An email has been sent to you"})
                })
            })
    })
})

module.exports = router