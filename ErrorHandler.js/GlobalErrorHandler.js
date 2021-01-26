const OperationalError = require('../utility/OperationalError');

const sendOperationalDev = (error, res) =>{
        res.status(error.statusCode).json({
        status: error.status,
        name: error.name,
        error: error,
        message: error.message,
        stackTrace: error.stack     
    });
}

const handleValidationErrors = (error) => {
    var input = [];
    for(const fieldName in error.errors) {
       input.push(error.errors[fieldName]);
    }

    const message = `Inavlid Values: ${input.join('.')}`;

    return new OperationalError('Invalid Values', 400, 'fail', message);
}

const handleDuplicateErrors = (error) => {
    const message = `Duplicate value '${error.keyValue[Object.keys(error.keyPattern)[0]]}' for the field '${Object.keys(error.keyPattern)[0]}'`;
    
    return new OperationalError('Duplicate Values', 400, 'fail', message);
}

const sendOperationalProd = (error, res) => {        
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    });
}


module.exports=(error, req, res, next) => {
    error.status = error.status || 'error';
    error.statusCode = error.statusCode || 500;

    if(process.env['NODE_ENVIRONMENT'] === 'DEVELOPMENT') {   
        sendOperationalDev(error, res);     
    }
    else if(process.env['NODE_ENVIRONMENT'] === 'PRODUCTION') {
        if(error.name === 'ValidationError') {
            error = handleValidationErrors(error);
        }

        else if(error.code === 11000) {
            error = handleDuplicateErrors(error, res);
        }
    
        sendOperationalProd(error, res)
    }
       
}