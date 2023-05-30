const catchAsyncError = require("../middlewares/catchAsyncError");
const Order = require("../models/order");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const Product = require('../models/product');
const User = require("../models/user");
const Discount = require("../models/discount");
const DiscountUsed = require("../models/discountUsed");
var ObjectId = require('mongodb').ObjectID;
const UserLogin = require('../models/userLogin');
const sendEmail = require("../utils/sendEmail");

exports.newOrder = catchAsyncError(async (req, res, next) => {

    var {
        orderItems,
        shippingInfo,
        paymentInfo,
        itemsPrice,
        taxPrice,
        totalPrice,
        orderStatus,
        shippingPrice,
        discountId,
        transactionEthereum
    } = req.body.data;
    var discount={}
    if(discountId){

       
        const discountModel=await Discount.findByIdAndUpdate(discountId,{$inc:{
            quantity:-1
        }})
        const order=await Order.findOne({
            "user":ObjectId(req.user._id),
            'discount.id':ObjectId(discountId)
        })
    
        if(order){
            return next(new ErrorHandler('Code discount used', 500))
        }
        
        discount={
            ...discount,
            id:discountModel.id,
            name:discountModel.name,
            categoryProduct:discountModel.categoryProduct,
            value:discountModel.value
        }
    }
    orderItems=await Promise.all(
        orderItems.map(async item=>{
            const product=await Product.findById(item.product)
            await UserLogin.findOneAndUpdate({
                _id:req.user._id,
            },{$pull:{
                'cart':{
                    'productId':product._id
                }
            }}
            
            )
            
            return {
                ...item,
                name:product.name,
                price:product.price,
                image:product.images[0].url
            }
           
        })
    )


    const order=await Order.create({
        orderItems,
        shippingInfo,
        paymentInfo,
        itemsPrice,
        taxPrice,
        totalPrice,
        orderStatus,
        shippingPrice,
        user: req.user.id,
        discount,
        transactionEthereum
    })
    try{
        const user=await User.findById(req.user.id)
        const message=`Kính gửi Quý khách hàng, ${user.name} 

Lời đầu tiên xin được thay mặt toàn bộ đội ngũ nhân viên gửi lời cảm ơn chân thành và sâu sắc nhất tới Quý khách hàng đã đồng hành, hợp tác cũng như ủng hộ cửa hàng trong thời gian qua.

Chính những sự yêu mến và niềm tin của Quý khách hàng là niềm tự hào và thành công lớn nhất của chúng tôi, đồng thời cũng là động lực để chúng tôi tiếp tục phát triển trong tương lai. 

Hy vọng trong thời gian sắp tới, mối quan hệ của hai bên càng lúc càng bên chặt. Chúng tôi sẽ không ngừng phát triển, nâng cao chất lượng dịch vụ để có thể phục vụ Quý khách hàng tốt hơn. 

Một lần nữa, chúng tôi xin gửi lời cảm ơn chân thành và sự tri ân sâu sắc tới Quý khách hàng. Xin chúc bạn sức khỏe luôn dồi dào, hạnh phục và thành công. 

Trân Trọng!`
        await sendEmail({
            email:user.emailUser,
            subject :'Đặt hàng thành công!',
            message
        })
    }catch(error){

    }




    res.status(200).json({
        success: true,
        order
    })
})
exports.getOderDetail = catchAsyncError(async (req, res, next) => {
    var order = await Order.findById(req.params.id)
    if (!order) {
        return next(new ErrorHandler('order not found', 404))
    }
    // const discount=await Discount.findById(order.discountId)
    const user=await User.findById(order.user)
    if(!user){
        return next(new ErrorHandler('user not found', 404))

    }
    
    res.status(200).json({
        success: true,
        order,
        orderItems:order.orderItems,
        user,
        discount:order.discount
    })
})
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
        success: true,
        orders
    })
})
exports.allOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find()
    let totalPayment = 0;
    orders.forEach(order => {
        if(order.orderStatus=='Complete'){
            totalPayment += order.totalPrice
        }
    })
    res.status(200).json({
        success: true,
        totalPayment,
        orders
    })
})

exports.orderSearch=catchAsyncError(async (req, res, next) => {
    const resPerPage=10
    const apiFeatures=new APIFeatures(Order.find(),req.query)
    .sortByOrder()
    .pagination(resPerPage)
    const ordersPage=await apiFeatures.query;
    res.status(200).json({
        success: true,
        ordersPage

    })
})

exports.myOrderSearch=catchAsyncError(async (req, res, next) => {
    const resPerPage=10
    const apiFeatures=new APIFeatures(Order.find({user:req.user._id}),req.query)
    .sortByOrder()
    .pagination(resPerPage)
    const ordersPage=await apiFeatures.query;
    res.status(200).json({
        success: true,
        ordersPage
    })
})

exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler('Order not found', 404))
    }
    order.orderStatus = req.body.orderStatus
    if(order.orderStatus == 'Confirmed'){
        order.orderItems.forEach(async item => {
            const product = await Product.findById(item.product);
            if(product.stock<item.quantity){
                return next(new ErrorHandler('Stock product less then item request', 404))
            }
            product.stock -= item.quantity
            await product.save()

        })
    }
    if (order.orderStatus == 'Delivered') {
        order.deliveredAt=Date.now()
    }
    if(order.orderStatus=='Complete'){
        order.paidAt=Date.now()
    }
    await order.save();

    res.status(200).json({
        success: true,
        order
    })
})
exports.deleteOrderBeforeDelivered = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler('Order not found', 404))
    }
    if (order.orderStatus == 'Confirmed' || order.orderStatus == 'Processing') {
        await order.remove()
    }
    else{
        return next(new ErrorHandler(`Order have ${order.orderStatus}`, 500))
    }
    res.status(200).json({
        success: true
    })
})

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new ErrorHandler('Order not found', 404))
    }
    await order.remove()
    res.status(200).json({
        success: true
    })
})

exports.payUsingEthereum=catchAsyncError(async (req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if (!order) {
        return next(new ErrorHandler('Order not found', 404))
    }
    const {amount,orderETH}=req.body
    if(amount<orderETH){
        return next(new ErrorHandler('amount must > orderETH', 404))
    }
    order.paymentMethod='ETH'
    await order.save()
    res.status(200).json({
        success: true
    })
})