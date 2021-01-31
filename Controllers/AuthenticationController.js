const user = require('../Models/UserModel');
const CatchAsync = require('../utility/CatchAsync');
const jwt = require('jsonwebtoken');
const OpeartionalError = require('../utility/OperationalError');
// const ApiFeature = require('../utility/ApiFeature');

const sendAuthToken = (res, userEntity) => {
    const authToken = jwt.sign({id: userEntity.id}, process.env['SECURITY_TOKEN_STRING'], {
        expiresIn: process.env['JWT_EXPIRY']
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
            expiresAt: cookieExpiry.toUTCString()
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
        const userToLog =  await user.findOne({email: userEmail}, {password: 1, id: 1, name: 1, email: 1});
       if(userToLog) {
           if(await userToLog.verifyPassword(userPassword)) {
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

module.exports.validateAuthentication = CatchAsync(async(req, res, next) => {
    let data;
    let userData;

    if(req.cookies.authToken) {
        const authToken = req.cookies.authToken;
        try {
            data = jwt.verify(authToken, process.env['SECURITY_TOKEN_STRING']);

            if(data) {
                const tokenCreationDate = new Date(data.iat * 1000);
                const tokenExpiryDate = new Date(data.exp * 1000);
                const userId = data.id;
    
                userData = await user.findOne({_id: userId}, {name: 1, email: 1, modifiedAt: 1, createdAt: 1, id: 1});
                req.user = {
                    name: userData.name,
                    id: userData.id,
                    email: userData.email,
                };
                
                if(userData.modifiedAt) {             
                   if(tokenCreationDate < new Date(userData.modifiedAt)) {
                        req.user = null;
                   }
                }
            }
        }
        catch(err) {
            console.log(err);
            data = null;
            //throw new OpeartionalError('Invalid Authentication', 400, 'fail', 'Authentication token wrongly modified');
        }            
    }  
    console.log(req.user);
    next();
});

module.exports.protectRoute = CatchAsync(async(req, res, next) => {});

module.exports.validateAutherization = CatchAsync(async(req, res, next) => {});


module.exports.forgetPassword = CatchAsync(async(req, res, next) => {});

module.exports.modifyUser = CatchAsync(async(req, res, next) => {});

module.exports.deactivteUser = CatchAsync(async(req, res, next) => {});

module.exports.getUsers = CatchAsync(async(req, res, next) => {});

module.exports.getUser = CatchAsync(async(req, res, next) => {});