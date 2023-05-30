const Review =require('../models/review')
const User =require('../models/user')
const Product =require('../models/product')
const Order =require('../models/order')
const ErrorHandler=require('../utils/errorHandler')
const catchAsyncError=require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures')
exports.addReview=catchAsyncError(async (req,res,next)=>{
    
   
    const {rating,comment,productId}=req.body

    var product=await Product.findOneAndUpdate({
        _id:productId,
        'reviews.userId':req.user._id
    },{
        $set:{
            "reviews.$.rating":rating,
            "reviews.$.comment":comment,
        }
    })

    if(!product){
        const order=await Order.findOne({
            user:req.user._id,
            'orderItems.product':productId,
            orderStatus:'Complete'
        });
        if(!order){
            return next(new ErrorHandler('Not found', 404))
        }
        product = await Product.findOneAndUpdate({
            _id:productId
        },{
            $push:{
                "reviews":{
                    rating:rating,
                    comment:comment,
                    userId:req.user._id
                }
            }
        })
    }
  
    res.status(200).json({
        success: true,
        product
    })
})
exports.getAllReviewByProduct=catchAsyncError(async (req,res,next)=>{
    const product=await Product.findById(req.query.id)
    var list=await Promise.all(product.reviews.map(async item=>{
        try{
            const user=await User.findById(item.userId)
            return {
                comment: item.comment,
                rating:item.rating,
                createAt:item.createAt,
                image:user.avatar.url,
                userName:user.name
            }
        }catch (error) {
            console.log('error'+ error);
          }
    }))
   
      let averageReview = list.reduce((a, b) =>a + Number (b.rating),0) / list.length;
    res.status(200).json({
        success: true,
        list,
        averageReview
    })
})