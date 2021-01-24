const express =  require('express');
const bodyParser = require('body-parser');
require('dotenv').config({path: `${__dirname}/config.env`});
const productRouter  = require('./Routes/ProductRouter');
const categoryRouter  = require('./Routes/CategoryRoutes');

const app = express();

app.use(bodyParser.json());


app.use('/heyCart/api/v1/products', productRouter);
app.use('/heyCart/api/v1/categories', categoryRouter);

module.exports = app;