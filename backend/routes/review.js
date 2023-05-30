const express=require('express')
const router=express.Router()
const { addReview, getAllReviewByProduct } = require('../controllers/reviewController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/user')

router.route('/review').put(isAuthenticatedUser,addReview)
router.route('/reviews').get(getAllReviewByProduct)

module.exports=router;

