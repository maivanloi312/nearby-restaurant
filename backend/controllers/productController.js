const Product =require('../models/product')
const checkUrlImage  =require('./../utils/checkUrlImage');
const ErrorHandler=require('../utils/errorHandler')
const catchAsyncError=require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures')
const cloudinary=require('cloudinary');
const UserLogin = require('../models/userLogin');
const User = require('../models/user');
const Review = require('../models/review');
const Inventory = require('../models/inventory');
const Cart = require('../models/cart');
//add new product
exports.newProduct=catchAsyncError (async (req,res,next)=>{
    if(!checkUrlImage(req.body.data.image)){
        const result=await cloudinary.v2.uploader.upload(req.body.data.image,{
            folder:'tazas'
        })
        if(result){
            req.body.data.images=[]
            req.body.data.images.push({
                url:result.secure_url,
                public_id:result.asset_id
            })
        }
    }
    const user=await User.findById(req.user.id)
 
    const {name,price,description,classify,category,stock,images}=req.body.data
    const data={
        name:name,
        price:price,
        description:description,
        classify:classify,
        category:category,
        stock:stock,
        images:images,
        user:user._id,
        seller:user.name
    }
    const product= await Product.create(data)
  

    product.save()
    res.status(201).json({
        success:true,
        product
    })
})

exports.uploadImage=catchAsyncError(async (req,res,next)=>{
    var result;
    if(!checkUrlImage(req.body.image)){
        result =await cloudinary.v2.uploader.upload(req.body.image,{
            folder:'tazas'
        })
        
    }
    res.status(201).json({
        success:true,
        result
    })
})

exports.getAllProduct=catchAsyncError(async (req,res,next)=>{
    const products= await Product.find()
    res.status(201).json({
        success:true,
        products
    })
})

exports.getLengthProduct=catchAsyncError(async(req,res,next)=>{
    const products=await Product.find();
    res.status(201).json({
        success:true,
        lengthProducts:products.length
    })
})
//get all product {{DOMAIN}}/api/v1/products?keyword=?
exports.getProducts=catchAsyncError(async (req,res,next)=>{
    const resPerPage=10
    const apiFeatures=new APIFeatures(Product.find(),req.query)
    .sort()
    .search()
    .pagination(resPerPage)
    const products=await apiFeatures.query;
    res.status(200).json({
        success:true,
        products
    })
})

exports.getAllProducts=catchAsyncError(async (req,res,next)=>{
    const apiFeatures=new APIFeatures(Product.find(),req.query)
    .sort()
    .search()
    const products=await apiFeatures.query;
    res.status(200).json({
        success:true,
        products
    })
})

//get all product {{DOMAIN}}/api/v1/products?keyword=?
exports.getProductsHome=catchAsyncError(async (req,res,next)=>{
    const resPerPage=6
    
  
    const apiFeatures=new APIFeatures(Product.find(),req.query)
    
    .sort()
    .search()
    .filter()
    // .random()
    // .pagination(resPerPage)
    const products=await apiFeatures.query;
    
    res.status(200).json({
        success:true,
        products
    })
})

exports.getRandomProduct=catchAsyncError(async (req,res,next)=>{
    const products=await Product.aggregate([{ $sample: { size: 10 } }])

    res.status(200).json({
        success:true,
        products
    })
})

//get single product
exports.getSingleProduct=catchAsyncError(async (req,res,next)=>{
    const product=await Product.findById(req.params.id).catch(error=>console.error())

    if(!product){
        return next(new ErrorHandler('Product not found',404));
    }
    res.status(200).json({
        success:true,
        product
    })
})

//update product
exports.updateProduct=catchAsyncError(async (req,res,next)=>{
    
    
   
    if(!checkUrlImage(req.body.data.image)){
        const result=await cloudinary.v2.uploader.upload(req.body.data.image,{
            folder:'tazas'
        })
        if(result){
            req.body.data.images=[]
            req.body.data.images.push({
                url:result.secure_url,
                public_id:result.asset_id
            })
        }
    }
    
   
    const product=await Product.findByIdAndUpdate(req.params.id,req.body.data,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        product
    })
})

//delete product
exports.deleteProduct=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.params.id).catch(error=>console.error())
    if(!product){
        return next(new ErrorHandler('Product not found',404));
    }
    await product.remove()
  
    res.status(200).json({
        success:true,
        message:"Product is deleted"
    })
})

exports.createProductReview=catchAsyncError(async(req,res,next)=>{
    const {rating,comment,productId,avatar}=req.body
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        avatar,
        comment
    }
    const product=await Product.findById(productId)

    const isReviewed=product.reviews.find(
        r=>r.user.toString()===req.user._id.toString()
    )
    
    //update review
    if(isReviewed){
        product.reviews.forEach(review=>{
            if(review.user.toString()===req.user._id.toString()){
                review.comment=comment
                review.rating=rating
            }
        })
    }
    else{
        product.reviews.push(review)
        product.numOfReviews=product.reviews.length
    }

    //update ratings
    product.ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length
    await product.save({validateBeforeSave:false})
    res.status(200).json({
        success:true
    })
})
exports.getAllReviews=catchAsyncError(async(req,res,next)=>{
    const product= await Product.findById(req.query.id)
    if(!product){
        return next(new ErrorHandler('Product  not found',404))
    }
        
    const allReviews=product.reviews
    res.status(200).json({
        success:true,
        allReviews
    })
})
exports.deleteReview=catchAsyncError(async(req,res,next)=>{
    const product= await Product.findById(req.query.id)
    if(!product){
        return next(new ErrorHandler('Product  not found',404))
    }
    const reviews= product.reviews.filter(rv=>rv._id.toString()!==req.query.reviewId.toString())
    const numOfReviews=reviews.length
    const ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/reviews.length
    await Product.findByIdAndUpdate(req.query.id,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true
    })
})