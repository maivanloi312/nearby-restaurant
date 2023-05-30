const mongoose=require('mongoose')
const inventorySchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        require:true
    },
    quantity:{
        type:Number,
        require:true
    },
    updateDate:{
        type:Date,
        default:Date.now()
    }

})
module.exports=mongoose.model('Inventory',inventorySchema)