const express = require('express');

const {addCategory, getCategories, getCategory, updateCategory, deleteCategory} = require('../Controllers/CategoryController');

const categoryRouter = express.Router();

categoryRouter.route('/').get(getCategories);
                        

categoryRouter.route('/:id').get(getCategory)
                        .post(addCategory)
                        .patch(updateCategory)
                        .delete(deleteCategory);

module.exports = categoryRouter;    