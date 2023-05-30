const User=require('../models/user')
const ErrorHandler=require('../utils/errorHandler')
const catchAsyncErrors=require('../middlewares/catchAsyncError')
const sendToken=require('../utils/jwtToken')
const sendEmail=require('../utils/sendEmail')
const crypto=require('crypto')
const cloudinary=require('cloudinary')
const APIFeatures = require('../utils/apiFeatures')
const checkUrlImage = require('../utils/checkUrlImage')
const UserLogin = require('../models/userLogin')
const Product=require('../models/product')
exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
   
    const {email,password}=req.body
    const userLogin=await UserLogin.create({
        email,
        password,
        // avatar
    })
    const user=await User.create({
        name:`Customer ${userLogin._id}`,
        _id:userLogin._id,
        avatar:{
            public_id:'esgwlofliym7hrt08vch',
            url:'https://res.cloudinary.com/tazas/image/upload/v1620570274/tazas/esgwlofliym7hrt08vch.png'
        },
        cartItems:[],
        placeOfBirth:'',
        dateOfBirth:'',
        phoneNumber:'',
        emailUser:email
    })
    sendToken(userLogin,200,res)

})

exports.loginUser=catchAsyncErrors(async(req,res,next)=>{
    const {email,password}=req.body
    //check email or password entered
    if(!email||!password){
        return next(new ErrorHandler('Please enter email or password',400))
    }
    //finding user in database
    const userLogin=await UserLogin.findOne({email}).select('+password')

    if(!userLogin){
        return next(new ErrorHandler('Invalid email or password',401))
    }
    //check password correct or not
    const isPasswordMatched=await userLogin.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password',401))
    }
    
    sendToken(userLogin,200,res)
})

exports.logoutUser=catchAsyncErrors(async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"logged out"
    })
})

exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{
    const userLogin= await UserLogin.findOne({email: req.body.email})
    if(!userLogin){
        return next(new ErrorHandler('User not found with this email',404))
    }
    const resetToken=userLogin.getResetPasswordToken()
    const numberToken=userLogin.getRandomNumberBetween(999999,100000)
    await userLogin.save({validateBeforeSave:false})
    const resetUrl=`${process.env.NODE_ENV!=='PRODUCTION'? process.env.FRONTEND_URL:'https://deskita-ecommerce.herokuapp.com'}/api/v1/password/reset/${resetToken}`
    const message =`Your password reset token is a follow: \n\n${resetUrl}\n\nIf you have not requested this email, then ignore it
    \n\n If you recovery with app mobile, code you app mobile: ${numberToken}`
    try {
        await sendEmail({
            email:userLogin.email,
            subject :'Deskita Password recovery',
            message
        })
        res.status(200).json({
            success:true,
            numberToken,
            message:`Email sent to:${userLogin.email}`
        })
    } catch (error) {
        userLogin.resetPasswordToken=undefined,
        userLogin.resetPasswordExpire=undefined
        userLogin.numberToken=undefined
        await userLogin.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message,500))
    }
})

exports.resetPassword=catchAsyncErrors(async(req,res,next)=>{

   
    var userLogin
    if(req.query.token){
        const resetPasswordToken=crypto.createHash('sha256').update(req.query.token).digest('hex');
        userLogin=await UserLogin.findOne({
            resetPasswordToken,
            resetPasswordExpire:{$gt:Date.now()}
        })
    }
    else{
        const numberToken=req.query.code
        userLogin=await UserLogin.findOne({
            numberToken,
            resetPasswordExpire:{$gt:Date.now()}
        })
    }
   
    if(!userLogin){
        return next(new ErrorHandler('Password reset token is invalid or has been expired',400))
    }
    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match',400))
    }
    userLogin.password=req.body.password
    userLogin.resetPasswordToken=undefined
    userLogin.resetPasswordExpire=undefined
    userLogin.numberToken=undefined
    await userLogin.save()
    sendToken(userLogin,200,res)
})

exports.userProfile=catchAsyncErrors(async(req,res,next)=>{
    const userLogin=await UserLogin.findById(req.user.id)

    if(!userLogin){
        return next(new ErrorHandler('User not found',400))
    }
    let user=(await User.findById(req.user.id)).toObject()
    user.role=userLogin.role
    
    res.status(200).json({
        success:true,
        user
    })
})

exports.userUpdatePassword=catchAsyncErrors(async(req,res,next)=>{
    const userLogin=await UserLogin.findById(req.user._id).select('+password');
    const isMatched=await userLogin.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect',404))
    }
    userLogin.password=req.body.password;
    await userLogin.save();
    sendToken(userLogin,200,res);

})
exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
    var avatar
    if(!checkUrlImage(req.body.avatarPr)){
        const result=await cloudinary.v2.uploader.upload(req.body.avatarPr,{
            folder:'tazas'
        })
        if(result){
            avatar={
                public_id:result.secure_url,
                url:result.secure_url
            }
        }
    }
    var newUserData={
        name:req.body.data.name,
        emailUser:req.body.data.emailUser,
        role:req.body.data.role,
        dateOfBirth:req.body.data.dateOfBirth,
        placeOfBirth:req.body.data.placeOfBirth,
        phoneNumber:req.body.data.phoneNumber
    }
    if(avatar){
        newUserData.avatar=avatar
    }
    const userLogin=await UserLogin.findByIdAndUpdate(req.user.id,{email: req.body.data.emailUser},{
         new:true,
        runValidators:true,
        useFindAndModify:false
    })
    const user=await User.findByIdAndUpdate( req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    await Product.updateMany({"user":req.user.id},{$set:{"seller":user.name}})
    res.status(200).json({
        success:true
    })
})

exports.allUsers=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.find()
    res.status(200).json({
        success:true,
        user
    })
})

exports.getUsersSearch=catchAsyncErrors(async(req,res,next)=>{
    const resPerPage=10
    const apiFeatures=new APIFeatures(User.find(),req.query)
    .search()
    .pagination(resPerPage)
    const users=await apiFeatures.query;
    
    res.status(200).json({
        success:true,
        users
    })
})
exports.getUserDetail=catchAsyncErrors(async(req,res,next)=>{
    const userLogin=await UserLogin.findById(req.params.id)
   
    let user=(await User.findById(req.params.id)).toObject()
    if(userLogin){
        user.role=userLogin.role
    }
    res.status(200).json({
        success:true,
        user
    })
})
exports.updateUser=catchAsyncErrors(async(req,res,next)=>{
    const {role}=req.body.data?req.body.data:req.body
    
    const user=await UserLogin.findByIdAndUpdate(req.params.id,{$set:{role:role}},{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    if(!user){
        return next(new ErrorHandler('User removed',404)) 
    }
    res.status(200).json({
        success:true,
        user
    })
})
exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id)
    const userLogin=await UserLogin.findById(req.params.id)
    if(!userLogin){
        return next(new ErrorHandler('user not found',404))
    }
    await userLogin.remove();
    res.status(200).json({
        success:true
    })
})

exports.deleteUserLoginMe=catchAsyncErrors(async(req,res,next)=>{
    const userLogin=await UserLogin.findById(req.user._id)
    if(!userLogin){
        return next(new ErrorHandler('user not found',404))
    }
    await userLogin.remove();
    res.status(200).json({
        success:true
    })
})

exports.addToCart=catchAsyncErrors(async(req,res,next)=>{
    const userLogin=await UserLogin.findById(req.user.id)
    const user=await User.findOne({userId: userLogin._id})
    if(!user){
        return next(new ErrorHandler('user not found',404))
    }
    var cartItems=user.cartItems
    var checkFindItem=false
        cartItems.forEach((item,index)=>{
            if(item.product==req.body.data.product){
                cartItems[index].quantity=item.quantity+1
                checkFindItem=true
            }
        })
        if(cartItems.length==0 || !checkFindItem){
            cartItems.push({
                product: req.body.data.product,
                checked:req.body.data.checked,
                quantity:1
            })
        }
    user.cartItems=cartItems
    await user.save()
    res.status(200).json({
        success:true
    })
    
})
exports.changeRoleUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await UserLogin.findByIdAndUpdate(req.params.id,{$set:{role:'admin'}})
    if(!user){
        return (new ErrorHandler('change role failed',404))
    }
    res.status(200).json({
        success:true
    })
})


//for mobile
exports.getAllUsers=catchAsyncErrors(async(req,res,next)=>{
    const userLogins=await UserLogin.find({role:req.query.type})
    const userIds=userLogins.map(userLogin=> ""+userLogin._id)
    const user=await User.find({_id:{$in:userIds}}).sort({createAt:-1})
    res.status(200).json({
        success:true,
        user
    })
})

exports.loginAdmin=catchAsyncErrors(async (req,res,next)=>{
    const {email,password}=req.body
    //check email or password entered
    if(!email||!password){
        return next(new ErrorHandler('Please enter email or password',400))
    }
    //finding user in database
    const userLogin=await UserLogin.findOne({email,role:'admin'}).select('+password')

    if(!userLogin){
        return next(new ErrorHandler('Invalid email or password',401))
    }
    //check password correct or not
    const isPasswordMatched=await userLogin.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password',401))
    }
    
    sendToken(userLogin,200,res)
})