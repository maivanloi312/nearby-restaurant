const express=require('express')
const router=express.Router()
const {
    registerUser,
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword, 
    userProfile, 
    userUpdatePassword, 
    updateProfile, 
    allUsers, 
    getUserDetail,
    updateUser,
    deleteUser,
    getUsersSearch,
    getAllUsers,
    deleteUserLoginMe,
    loginAdmin}=require('../controllers/userController')
const { isAuthenticatedUser ,authorizeRoles} = require('../middlewares/user')

router.route('/user/create').post(registerUser)
router.route('/user/login').post(loginUser)

router.route('/user/password/forgot').post(forgotPassword)
router.route('/user/password/reset').put(resetPassword)
router.route('/me').get(
    isAuthenticatedUser,
    userProfile)
    .delete(isAuthenticatedUser,deleteUserLoginMe)
router.route('/user/update-password').put(isAuthenticatedUser,userUpdatePassword)
router.route('/user/update-profile').put(
    isAuthenticatedUser,
    updateProfile)
router.route('/admin/all-user').get(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    allUsers)
router.route('/admin/users').get(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    getUsersSearch)
router.route('/admin/user/:id')
.get(isAuthenticatedUser,authorizeRoles('admin'),getUserDetail)
.put(isAuthenticatedUser,authorizeRoles('admin'),updateUser)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser)

//for mobile
router.route('/mobile/admin/user').get(isAuthenticatedUser,authorizeRoles('admin'),getAllUsers)
router.route('/admin/login').post(loginAdmin)
module.exports=router;
