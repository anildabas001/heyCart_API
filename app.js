const express =  require('express');
const bodyParser = require('body-parser');
require('dotenv').config({path: `${__dirname}/config.env`});
const productRouter  = require('./Routes/ProductRouter');
const categoryRouter  = require('./Routes/CategoryRoutes');
const OperationalError = require('./utility/OperationalError');
const globalErrorHandler = require('./ErrorHandler.js/GlobalErrorHandler');

const app = express();

app.use(bodyParser.json());


app.use('/heyCart/api/v1/products', productRouter);
app.use('/heyCart/api/v1/categories', categoryRouter);
app.use('*', (req, res, next) => next(new OperationalError('Page Not Found', 404, 'fail', 'Page Not Found')));
app.use(globalErrorHandler);

module.exports = app;