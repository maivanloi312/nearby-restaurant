const express=require('express');
const { addStock, getInventoryByProduct } = require('../controllers/inventoryController');
const router=express.Router()
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/user')
router.route('/add-stock').post(isAuthenticatedUser,authorizeRoles('admin'),addStock)
router.route('/get-inventory-by-product/:id').get(isAuthenticatedUser,authorizeRoles('admin'),getInventoryByProduct)
module.exports=router;
