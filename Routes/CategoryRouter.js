const express = require('express');

const {addCategory, getCategories, getCategory, updateCategory, deleteCategory} = require('../Controllers/CategoryController');
const {protectRoute, validateAutherization} = require('../Controllers/AuthenticationController');

const categoryRouter = express.Router();

categoryRouter.route('/').get(getCategories)
                         .post(protectRoute, validateAutherization('Administrator'), addCategory);                        

categoryRouter.route('/:id').get(getCategory)    
    .patch(protectRoute, validateAutherization('Administrator'),updateCategory)
    .delete(protectRoute, validateAutherization('Administrator'),deleteCategory);

module.exports = categoryRouter;    