const mongoose=require('mongoose')
const discountUsedSchema=mongoose.Schema({
    discountId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Discount',
        require:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    statusUsed:{
        type:Boolean,
        default:true
    }

})
module.exports=mongoose.model('DiscountUsed',discountUsedSchema)