const express=require('express');
const { newDiscountUsed } = require('../controllers/discountUsedController');
const router=express.Router()
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/user');

module.exports=router;