const express = require('express');

const {addProduct} = require('../Controllers/ProductController');

const productRouter = express.Router();

productRouter.route('/').get((req, res)=>{res.send('Products')})
                        .post(addProduct);

module.exports = productRouter;
