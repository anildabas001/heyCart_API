const express = require('express');

const {protectRoute, validateAutherization, resetPassword, loginUser, signupUser, modifyUser, deactivteUser, getUsers, getUser, logout, forgetPassword} = require('../Controllers/AuthenticationController');

const userRouter = express.Router();

userRouter.route('/login').post(loginUser);
userRouter.route('/signup').post(signupUser);         
userRouter.route('/modify').patch(protectRoute, modifyUser);
userRouter.route('/deleteUser').delete(protectRoute, deactivteUser);             
userRouter.route('/logout').get(protectRoute, logout);
userRouter.route('/forgetPassword').post(forgetPassword);
userRouter.route('/resetPassword/:resetToken').patch(resetPassword);
userRouter.route('/').get(protectRoute, validateAutherization('Administrator'), getUsers);
userRouter.route('/:email').get(protectRoute, getUser);
                        

module.exports = userRouter;    