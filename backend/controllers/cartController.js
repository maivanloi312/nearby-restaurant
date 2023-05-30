const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/user");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const Product = require('../models/product');
const Cart = require('../models/cart');
const userLogin = require("../models/userLogin");
var ObjectId = require('mongodb').ObjectID;
exports.addToCart=catchAsyncError(async(req,res,next)=>{
    var user=await userLogin.findOneAndUpdate({
        _id:req.user._id,
        "cart.productId":req.body.data.product
    },{
        $inc:{
            "cart.$.quantity":req.body.data.quantity
        }
    })
    if(!user){
        user= await userLogin.findByIdAndUpdate({
            _id:req.user._id,
           
        },{
            $push:{
               
                "cart":{
                    quantity:req.body.data.quantity,
                    productId:req.body.data.product
                }
            }
        })
    }

    res.status(200).json({
        success:true,
        user
    })
   
})
exports.getMyCart=catchAsyncError(async(req,res,next)=>{
    const user=await userLogin.findById(req.user._id)
    if(user.cart.length==0){
        return next(new ErrorHandler('cart empty', 404))
    }
   

    var myCart=[]
    await Promise.all(user.cart.map(async (item) => {
        try {
          // here candidate data is inserted into  
          const product=await Product.findById(item.productId)
          // and response need to be added into final response array 
          if(product){
            myCart.push( {
                _id:item._id,
                product:item.productId,
              checked:item.checked,
              name:product.name,
              image:product.images[0].url,
              price:product.price,
              quantity:item.quantity,
              category:product.category,
              total:Number (product.price*item.quantity)
          })
          }
          
        
        } catch (error) {
          console.log('error'+ error);
        }
      }))
      res.status(200).json({
        success:true,
        myCart
    })
})
exports.updateToCart=catchAsyncError(async(req,res,next)=>{
    const user=await userLogin.findByIdAndUpdate({
        '_id':ObjectId(req.user._id),
    },      
    {
        $pull:{
            "cart":{
                "_id":ObjectId(req.body.data)
            }
        }
    },
    {multi:true})
    // const cart=await Cart.findByIdAndDelete(req.body.data)
    if(!user){
        return next(new ErrorHandler('dont delete item in cart', 404))
    }
    res.status(200).json({
        success:true,
        user
    })
})