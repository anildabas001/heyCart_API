const user = require('../Models/UserModel');
const CatchAsync = require('../utility/CatchAsync');
const jwt = require('jsonwebtoken');
const OpeartionalError = require('../utility/OperationalError');
const { request } = require('../app');
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
    
                userData = await user.findOne({_id: userId}, {name: 1, email: 1, modifiedAt: 1, createdAt: 1, id: 1, role: 1});
                req.user = {
                    name: userData.name,
                    id: userData.id,
                    email: userData.email,
                    role: userData.role,
                };

                if(userData.modifiedAt) {             
                   if(tokenCreationDate < new Date(userData.modifiedAt)) {
                        req.user = null;
                   }
                }
            }
        }
        catch(err) {
            req.user = null;
            data = null;
            //throw new OpeartionalError('Invalid Authentication', 400, 'fail', 'Authentication token wrongly modified');
        }            
    }  

    next();
});

module.exports.protectRoute = CatchAsync(async(req, res, next) => {
    if(req.user) {
        return next();
    }
    else {
        throw new OpeartionalError('Not Authenticated', 401, 'fail', 'User is not authenticated');
    }
});

module.exports.validateAutherization = (requiredRole) => {
    const role = requiredRole;
    return CatchAsync(async(req, res, next) => {
        if(req.user) {
            if(req.user.role === role) {
                next();
            }
            else {
                throw new OpeartionalError('Not Authorized', 403, 'fail', 'User is not Autherized');
            }
        }
    });
};  

module.exports.forgetPassword = CatchAsync(async(req, res, next) => {

});

module.exports.logout = CatchAsync(async(req, res, next) => {
    req.user = null;
    res.status(200).clearCookie('authToken').send({
        status: 'success'
    })
});

module.exports.modifyUser = CatchAsync(async(req, res, next) => {        
    if(req.query.fiedToModify.toLowerCase() === 'name') {
        const modifieduser = await user.findByIdAndUpdate({_id: req.user.id}, {name: req.body.name},{new: true, runValidators:true});        
        return res.status(201).send({
            status: 'success',
            data: {
                name: modifieduser.name,
                email: modifieduser.email
            }
        });
    }    
    
    if(req.query.fiedToModify.toLowerCase() === 'password') {
        const userToModify = await user.findOne({_id: req.user.id});
        if(userToModify.verifyPassword(req.body.password)) {
            throw new OpeartionalError('Invalid Password', 400, 'fail' , 'Password must be different from the old password');
        }        
        userToModify.password = req.body.password;
        userToModify.confirmPassword = req.body.confirmPassword;
        const modifieduser = await userToModify.save();
        return res.status(201).send({
            name: modifieduser.name,
            email: modifieduser.email
        })
    }
});

module.exports.deactivteUser = CatchAsync(async(req, res, next) => {});

module.exports.getUsers = CatchAsync(async(req, res, next) => {console.log('reached');});

module.exports.getUser = CatchAsync(async(req, res, next) => {console.log('reached');});