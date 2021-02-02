const express = require('express');

const {setCategories, getProduct,getProducts, addProduct, updateProduct, deleteProduct} = require('../Controllers/ProductController');
const {protectRoute, validateAutherization} = require('../Controllers/AuthenticationController');

const productRouter = express.Router();

productRouter.route('/parent-category/:category').get(setCategories, getProducts)
productRouter.route('/').get(getProducts)
    .post(protectRoute, validateAutherization('Administrator'), addProduct);

productRouter.route('/:id').get(getProduct)
    .patch(protectRoute, validateAutherization('Administrator'), updateProduct)
    .delete(protectRoute, validateAutherization('Administrator'), deleteProduct);

module.exports = productRouter;
