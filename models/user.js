const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken:{
        type:String
    },
    expireToken:{
        type:Date
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/socialmedia-app/image/upload/v1611621302/woman-5813932_960_720_xxcmtq.png"
    },
    followers:[{
        type:ObjectId,ref:"User"
    }],
    following:[{
        type:ObjectId,ref:"User"
    }]
})

mongoose.model("User",userSchema)