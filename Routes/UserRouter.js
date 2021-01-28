const express = require('express');

const {loginUser, signupUser, modifyUser, deactivteUser, getUsers, getUser} = require('../Controllers/UserController');

const userRouter = express.Router();

userRouter.route('/login').post(loginUser);
userRouter.route('/signup').post(signupUser);         
userRouter.route('/modifyUser').patch(modifyUser);
userRouter.route('/deleteUser').delete(deactivteUser)                 

userRouter.route('/').get(getUsers)
userRouter.route('/:name').get(getUser);
                        

module.exports = userRouter;    