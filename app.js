const express =  require('express');
const bodyParser = require('body-parser');  
const cookieParser = require('cookie-Parser');
require('dotenv').config({path: `${__dirname}/config.env`});
const productRouter  = require('./Routes/ProductRouter');
const categoryRouter  = require('./Routes/CategoryRouter');
const userRouter  = require('./Routes/UserRouter');
const OperationalError = require('./utility/OperationalError');
const globalErrorHandler = require('./ErrorHandler.js/GlobalErrorHandler');
const {validateAuthentication} = require('./Controllers/AuthenticationController');
var cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('public'));
app.use(validateAuthentication);

const manageQueryString = (req, res, next) => {
    if(req.query) {
        Object.keys(req.query).map(key => {
            if(Array.isArray(req.query[key])) {
                req.query[key] = req.query[key][0];
            }
        })
    }
    next();
};

app.use(manageQueryString);


app.use('/heyCart/api/v1/products', productRouter);
app.use('/heyCart/api/v1/categories', categoryRouter);
app.use('/heyCart/api/v1/user', userRouter);
app.use('*', (req, res, next) => next(new OperationalError('Page Not Found', 404, 'fail', 'Page Not Found')));
app.use(globalErrorHandler);

module.exports = app;