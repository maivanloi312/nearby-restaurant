const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const userSchema=new mongoose.Schema({
    _id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserLogin'
    },
    name:{
        type:String,
        required: [true,'Please enter your name'],
        maxLength:[40,'Your name cannot exceed 30 characters']
    },
   
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    
    createAt:{
        type:Date,
        default:Date.now
    },
    
    placeOfBirth:{
        type:String
    },
    dateOfBirth:{
        type:String
    },
    phoneNumber:{
        type:String
    },
    emailUser:{
        type:String
    }

})

module.exports=mongoose.model('User',userSchema)