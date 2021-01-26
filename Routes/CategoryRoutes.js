const express = require('express');

const {addCategory} = require('../Controllers/CategoryController');

const categoryRouter = express.Router();

categoryRouter.route('/').get()
                        .post(addCategory);

module.exports = categoryRouter;    