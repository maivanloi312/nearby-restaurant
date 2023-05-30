const mongoose=require('mongoose')
const paymentSchema=mongoose.Schema({
    id:String,
    itemId:String,
    paid: Boolean
})
module.exports=mongoose.model('Payment',paymentSchema)
