const express = require('express');
const {protectRoute} = require('../Controllers/AuthenticationController');
const {fetchCart, updateCart} = require('../Controllers/CartController');

const cartRouter = express.Router();

cartRouter.route('/')
    .get(protectRoute, fetchCart)
    .patch(protectRoute, updateCart);
    
module.exports = cartRouter;