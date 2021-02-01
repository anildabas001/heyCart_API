const express = require('express');

const {loginUser, signupUser, modifyUser, deactivteUser, getUsers, getUser, logout} = require('../Controllers/AuthenticationController');

const userRouter = express.Router();

userRouter.route('/login').post(loginUser);
userRouter.route('/signup').post(signupUser);         
userRouter.route('/modify').patch(modifyUser);
userRouter.route('/deleteUser').delete(deactivteUser);             
userRouter.route('/logout').get(logout);
userRouter.route('/').get(getUsers);
userRouter.route('/:name').get(getUser);
                        

module.exports = userRouter;    