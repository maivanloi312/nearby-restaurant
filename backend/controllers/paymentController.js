const stripe= require('stripe')('sk_test_51It4PvLgUSTDjbyW1TX14NGrqt6rdXEquDcdixdFU5w3uojSzVzOTmoZwvy5UUN6ab4nPHGHvTw5NDeTcrrzVmZr00zDyQZhzu')
const catchAsyncError = require("../middlewares/catchAsyncError");
const Payment = require('../models/payment');

const items={
    '1':{id:1,url:'http://UrlToDownloadItem1'},
    '2':{id:2,url:'http://UrlToDownloadItem2'}
}
exports.processPayment=catchAsyncError(async (req,res,next)=>{
    
    const paymentIntent=await stripe.paymentIntents.create({
        amount:req.body.data*100,
        currency:'usd',
        metadata:{integration_check:'accept_a_payment'}
    })
    console.log(paymentIntent)
    res.status(200).json({
        success:true,
        client_secret:paymentIntent.client_secret
    })
})
exports.sendStripeApi=catchAsyncError(async(req,res,next)=>{
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_PUBLIC_KEY
    })
})
exports.helloworld=catchAsyncError(async(req,res,next)=>{
    const paymentId= (Math.random() *10000).toFixed(0);
    await Payment.create({
        id:paymentId,
        itemId:req.params.id,
        paid:false
    })

    res.status(200).json({
        stripeApiKey: paymentId
    })
})
exports.helloworld2=catchAsyncError(async(req,res,next)=>{
    const payment= await Payment.findOne({id:req.params.id});
    if(payment && payment.paid===true){
        res.status(200).json({
           url:items[payment.itemId].url
        })
    }
    res.status(200).json({
        url:""
     })
  
})