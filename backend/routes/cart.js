const express=require('express');
const { addToCart, getMyCart, updateToCart } = require('../controllers/cartController');
const router=express.Router()
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/user')
router.route('/add-to-cart').put(isAuthenticatedUser,addToCart)
router.route('/my-cart').get(isAuthenticatedUser,getMyCart)
router.route('/update-to-cart').put(isAuthenticatedUser,updateToCart)
module.exports=router;
