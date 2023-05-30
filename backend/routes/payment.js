const express=require('express');
const { processPayment, sendStripeApi,helloworld,helloworld2 } = require('../controllers/paymentController');
const router=express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/user')

router.route('/payment/process').post(isAuthenticatedUser,processPayment)
router.route('/get-stripe-api').get(isAuthenticatedUser,sendStripeApi)
router.route('/payment/getPaymentId/:id').get(helloworld)
router.route('/payment/getItemUrl/:id').get(helloworld2)
module.exports=router;