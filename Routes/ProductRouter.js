const express = require('express');

const {getProduct,getProducts, addProduct, updateProduct, deleteProduct} = require('../Controllers/ProductController');

const productRouter = express.Router();

productRouter.route('/').get(getProducts)
                        .post(addProduct)
productRouter.route('/:id').get(getProduct)
                           .patch(updateProduct)
                           .delete(deleteProduct);

module.exports = productRouter;
