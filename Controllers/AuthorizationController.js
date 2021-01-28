const user = require('../Models/UserModel');
const CatchAsync = require('../utility/CatchAsync');
const jwt = require('jsonwebtoken');
const OpeartionalError = require('../utility/OperationalError');
// const ApiFeature = require('../utility/ApiFeature');

const sendAuthToken = (res, userEntity) => {
    const authToken = jwt.sign({id: userEntity._Id}, process.env['SECURITY_TOKEN_STRING'], {
        expiresIn: '1h'
    });

    const cookieExpiry = new Date(Date.now() + Number(process.env['COOKIE_EXPIRY']));
    
    res.status(200).cookie('authToken',authToken, {
        expires: cookieExpiry,
        secure: false,
        httpOnly: true,
    }).send({
        status: 'success',
        data: {
            user: userEntity.name,
            email: userEntity.email,
            expiresAt: cookieExpiry
        }
    })
}

module.exports.signupUser = CatchAsync(async(req, res, next) => {
    const body = req.body;
    let signupUser;

    try {
         signupUser = await user.create({
            name: body.name,
            email: body.email,
            password: body.password,
            confirmPassword: body.confirmPassword
        });
    }
    catch(error) {
        return res.status(500).json({
            status: 'error',
            message: 'Signup failed'
        });
    }
    
    sendAuthToken(res, signupUser);    
});

module.exports.loginUser = CatchAsync(async(req, res, next) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    if(userEmail  &&  userPassword) {        
        const userToLog =  await user.findOne({email: userEmail});
       if(userToLog) {
           if(userToLog.verifyPassword(userPassword)) {
                sendAuthToken(res, userToLog);
           }
           else {
                throw  new OpeartionalError('Invalid Inputs', 401, 'fail', 'Invalid Email or Password');
           }
        }       
        else {
            throw  new OpeartionalError('Invalid Inputs', 401, 'fail', 'Invalid Email or Password');
        }         
    }
    else {
        throw new OpeartionalError('Invalid Inputs', 401, 'fail', 'Please Enter Email or Password');
    }
});

module.exports.modifyUser = CatchAsync(async(req, res, next) => {});

module.exports.deactivteUser = CatchAsync(async(req, res, next) => {});

module.exports.getUsers = CatchAsync(async(req, res, next) => {});

module.exports.getUser = CatchAsync(async(req, res, next) => {});