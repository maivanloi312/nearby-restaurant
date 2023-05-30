const catchAsyncError = require("../middlewares/catchAsyncError");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const Discount = require('../models/discount');
const DiscountUsed = require("../models/discountUsed");
const Order = require("../models/order");
var ObjectId = require('mongodb').ObjectID;
exports.createDiscount=catchAsyncError(async(req,res,next)=>{
    const {name,categoryProduct,validDate,quantity,value}=req.body.data
    await Discount.create({
        name,
        categoryProduct,
        validDate,
        quantity,
        value,
        userId:req.user._id
    })
    res.status(200).json({
        success:true
    })
})
exports.getAllDiscount=catchAsyncError(async(req,res,next)=>{
    const discounts=await Discount.find()
  
    res.status(201).json({
        success:true,
        discounts
    })
})
exports.getDiscountDetail=catchAsyncError(async(req,res,next)=>{
    const discount=await Discount.findById(req.params.id)
    res.status(201).json({
        success:true,
        discount
    })

})
exports.getDiscountByName=catchAsyncError(async(req,res,next)=>{
    const resPerPage=99999
    const apiFeatures=new APIFeatures(Discount.find(),req.query)
    .search()
    .pagination(resPerPage)
    const list=await apiFeatures.query;
    const discounts=await Promise.all(list.map(async (item) => {
        try {
            const order=await Order.findOne({
                "user":ObjectId(req.user._id),
                'discount.id':ObjectId(item._id)
            })
            if(order){
                return {...item.toObject(),used:true}
            }
            return {...item.toObject(),used:false}
            
        }
         catch (error) {
          console.log('error'+ error);
        }
      }))
    discounts.sort((a,b)=>b.createAt.getTime()-a.createAt.getTime())
    res.status(200).json({
        success:true,
        discounts,
    })
})

exports.removeDiscount=catchAsyncError(async(req,res,next)=>{
    await Discount.findByIdAndRemove(req.params.id)
    res.status(201).json({
        success:true,
    })
})

exports.updateStock=catchAsyncError(async(req,res,next)=>{
    await Discount.findByIdAndUpdate(req.params.id,{$inc:{quantity:+Number(req.body.data)}})
    res.status(201).json({
        success:true,
    })
})

exports.getDiscount=catchAsyncError(async(req,res,next)=>{
    const discount=await Discount.findOne({name:req.params.name})
    if(!discount){
        return next(new ErrorHandler('discount not found',404))
    }
    const order=await Order.findOne({
        "user":ObjectId(req.user._id),
        'discount.id':ObjectId(discount._id)
    })

    if(order){
        return next(new ErrorHandler('Code discount used', 500))
    }
    
    
    res.status(201).json({
        discount
    })
})
