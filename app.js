const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const { MONGOURI } = require('./config/keys')
const path = require('path')


//Connect to DB
mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log('Connected to MongoDB')
})
mongoose.connection.on('error',(err)=>{
    console.log('Error connecting to DB',err)
})


//Models
require('./models/user')
require('./models/post')

//Routes
app.use(express.json());
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/build'))
    
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log("Server is running on ",PORT)

})
