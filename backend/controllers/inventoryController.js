const catchAsyncError = require("../middlewares/catchAsyncError");
const Inventory = require("../models/inventory");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user");

exports.addStock=catchAsyncError(async(req,res,next)=>{
    const {productId,quantity}=req.body.data
    const data={
        userId:req.user._id,
        quantity:quantity
    }
    const product=await Product.findById(productId)
    product.stock+=quantity;
    product.updateStock.push(data)
    await product.save()
    // const inventory= product.updateStock
    // await Product.findByIdAndUpdate(productId,{$inc:{stock:+quantity},updateStock:})
    // const inventory=await Inventory.create(data)
    res.status(200).json({
        success:true,
        
    })
})
exports.getInventoryByProduct=catchAsyncError(async(req,res,next)=>{
   const inventories=await Product.findOne({_id:req.params.id})
   if(!inventories){
    return (new ErrorHandler('inventory not found',404))
}   
    const list=await Promise.all(inventories.updateStock.map(async (item) => {
        try {
           
                const user=await User.findById(item.userId)
                return {
                    seller: user.name,
                    quantity:item.quantity,
                    updateDate:item.updateDate
                }
            
        }
         catch (error) {
          console.log('error'+ error);
        }
      }))
   
    res.status(200).json({
        success:true,
        list
    })
})