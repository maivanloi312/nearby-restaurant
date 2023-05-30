const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const userLoginSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Please enter your email'],
        unique:true,
        validate:[validator.isEmail,'Please enetr valid email address']
    },
    password:{
        type:String,
        required:[true,'Please enter your Password'],
        minlength:[6,'Your password must be longer than 6 characters'],
        select:false
    },
    role:{
        type:String,
        default:'user'
    },
    cart:[
        {
            checked:{
                type:Boolean,
                default:true
            },
            quantity:{
                type:Number,
                required:true,
            },
            
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'Product'
            }
        }
    ],
    discounts:[
        {
           
            _id:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'Discount'
            }
        }
    ],
    numberToken:Number,
    resetPasswordToken:String,
    resetPasswordExpire:Date
})
userLoginSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password=await bcrypt.hash(this.password,10)
})

userLoginSchema.methods.getJwtToken=function(){
    const token=jwt.sign(
        {
            id:this._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES_TIME
        }
    
    )
    return token
}
userLoginSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userLoginSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire=Date.now()+30*60*1000
    return resetToken
}

userLoginSchema.methods.getRandomNumberBetween=function(max,min){
    this.numberToken=Math.floor(Math.random() * (max - min + 1) + min)
    return this.numberToken
};

module.exports=mongoose.model('UserLogin',userLoginSchema)