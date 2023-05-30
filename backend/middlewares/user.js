const User=require('../models/user')
const jwt=require('jsonwebtoken')
const ErrorHandler=require('../utils/errorHandler')
const catchAsyncErrors=require('../middlewares/catchAsyncError')
const UserLogin = require('../models/userLogin')
exports.isAuthenticatedUser=catchAsyncErrors(async (req,res,next)=>{
    const token=(req.query.userToken)?(req.query.userToken):req.body.params.userToken

    if(!token){
        return next(new ErrorHandler('Login first to access this resource',401))
    }
    //get id user from jwt 
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    req.user=await UserLogin.findById(decoded.id)
    next()
})
exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`,403))
        }
        next()
    }
}
