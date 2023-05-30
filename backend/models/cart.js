const mongoose=require('mongoose')
const cartSchema=mongoose.Schema({
    checked:{
        type:Boolean,
        default:true
    },
    quantity:{
        type:Number,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Product'
    }
})
module.exports=mongoose.model('Cart',cartSchema)
