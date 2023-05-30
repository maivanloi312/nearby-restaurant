const express=require('express');
const router=express.Router()
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/user')
const { createDiscount, getAllDiscount, getDiscountDetail, getDiscountByName, removeDiscount, updateStock, getDiscount } = require('../controllers/discountController');

router.route('/create-discount').post(isAuthenticatedUser,authorizeRoles('admin'),createDiscount)
router.route('/admin/discounts').get(isAuthenticatedUser,getDiscountByName)
router.route('/admin/discount/:id').get(getDiscountDetail)
.delete(isAuthenticatedUser,authorizeRoles('admin'),removeDiscount)
.put(isAuthenticatedUser,authorizeRoles('admin'),updateStock)
router.route('/discount/:name').get(isAuthenticatedUser,getDiscount)
router.route('/discounts').get(getDiscountByName)

module.exports=router;
