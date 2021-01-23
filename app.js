const express =  require('express');
const bodyParser = require('body-parser');
require('dotenv').config({path: `${__dirname}/config.env`});

const app = express();

app.use(bodyParser.json());




module.exports = app;