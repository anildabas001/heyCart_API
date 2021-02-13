const user = require('../Models/UserModel');
const CatchAsync = require('../utility/CatchAsync');
const jwt = require('jsonwebtoken');
const OpeartionalError = require('../utility/OperationalError');
const { request } = require('../app');
const mailer = require('../utility/MailSender');
const { find } = require('../Models/UserModel');
// const ApiFeature = require('../utility/ApiFeature');

const updatePassword = async (res, userToModify, password, confirmPassword) => {

    if(await userToModify.verifyPassword(password)) {
        throw new OpeartionalError('Invalid Password', 400, 'fail' , 'Password must be different from the old password');
    }        
    userToModify.password = password;
    userToModify.confirmPassword = confirmPassword;
    userToModify.modifiedAt = new Date(Date.now()).toUTCString();
    const modifieduser = await userToModify.save();
    
    sendAuthToken(res, modifieduser);
}

const createMailBody = (targetUser, link) => {
    return {
        to: targetUser.email,
        from: process.env['EMAIL_FROM'],
        subject: "Password change request",
        html: `Hi ${targetUser.name} <br> 
    Please click on the following <a href = ${link}>link</a> to reset your password. <br> <br>
    If you did not request this, please ignore this email and your password will remain unchanged.<br><br> 
    Regards, <br>
    HeyCart`,
    };
}

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

    
    signupUser = await user.create({
        name: body.name,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword
    });
    
    // catch(error) {
    //     return res.status(500).json({
    //         status: 'error',
    //         message: 'Signup failed'
    //     });
    //}
    
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
            if(req.user.role.toLowerCase() === role.toLowerCase()) {
                next();
            }
            else {
                throw new OpeartionalError('Not Authorized', 403, 'fail', 'User is not Autherized');
            }
        }
    });
};  

module.exports.forgetPassword = CatchAsync(async(req, res, next) => {
    const targetUser = await user.findOne({email: req.body.email});
    if(targetUser) {
        const passwordReserttOKEN = targetUser.generateResetToken();
        targetUser.save();
        const link = `http://${req.headers.host}/heyCart/api/v1/user/resetPassword/${passwordReserttOKEN}`;

        const mailBody = createMailBody(targetUser, link);

        mailer.sendMail(mailBody).then(data => {
            res.status(200).send({
                status: 'success',
                data: "Email sent to the user with password reset link."
            })
        }).catch(err => {
            throw new OpeartionalError('Mail Not Sent', 500, 'fail', 'not able to send the mail, please check if email is correct');
        });
    }
    else {
        throw new OpeartionalError('Non Existant', 400, 'fail', 'User does not exist');
    }
});

module.exports.logout = CatchAsync(async(req, res, next) => {
    req.user = null;
    res.status(200).clearCookie('authToken').send({
        status: 'success'
    })
});

module.exports.modifyUser = CatchAsync(async(req, res, next) => {        
    if(req.query.fieldToModify.toLowerCase() === 'name') {
        const modifieduser = await user.findByIdAndUpdate({_id: req.user.id}, {name: req.body.name},{new: true, runValidators:true});
        return res.status(201).send({
            status: 'success',
            data: {
                name: modifieduser.name,
                email: modifieduser.email
            }
        });
    }    
    
    if(req.query.fieldToModify.toLowerCase() === 'password') {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const userToModify = await user.findOne({_id: req.user.id}, {password: 1, name: 1, email: 1});

        await updatePassword(res, userToModify, password, confirmPassword);
        // if(await userToModify.verifyPassword(req.body.password)) {
        //     throw new OpeartionalError('Invalid Password', 400, 'fail' , 'Password must be different from the old password');
        // }        
        // userToModify.password = password;
        // userToModify.confirmPassword = confirmPassword;
        // userToModify.modifiedAt = new Date(Date.now()).toUTCString();
        // const modifieduser = await userToModify.save();
        
        // sendAuthToken(res, modifieduser);

        // return res.status(201).send({
        //     name: modifieduser.name,
        //     email: modifieduser.email
        // })
    }
});

module.exports.resetPassword = CatchAsync(async(req, res, next) => {
    const resetToken = req.params.resetToken;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const targetUser = await user.findOne({['passwordReset.token']: resetToken}, {passwordReset: 1, name: 1, email: 1, modifiedAt: 1, password: 1});

    if(targetUser) {
        if(new Date(targetUser.passwordReset.expiresAt) > new Date(Date.now())) {
            await updatePassword(res, targetUser, password, confirmPassword);
        }
        else {
            throw new OpeartionalError('Reset token expiredd', 400, 'fail' , 'Reset Link has expired. Please try again');
        }
    }
    else {
        throw new OpeartionalError('Invalid User', 400, 'fail' , 'Failed to update the password. Please try again.');
    }
});

module.exports.deactivteUser = CatchAsync(async(req, res, next) => {
    const email = req.params.email;
    const requestedUser = await findOne({email: email}, {name: 1, email: 1, active: 1});
    requestedUser.active = 1;

    await requestedUser.save();

    res.status(200).send({
        status: 'success',
        data: 'user has been deactivated'
    });
});

module.exports.getUsers = CatchAsync(async(req, res, next) => {
    const users = await find({}, {name: 1, email: 1, active: 1, createdAt: 1, modifiedAt: 1});
    res.status(200).send({
        status: 'success',
        data: users
    });
});

module.exports.getUser = CatchAsync(async(req, res, next) => {
    const email = req.params.email;
    const requestedUser = await findOne({email: email}, {name: 1, email: 1});
    res.status(200).send({
        status: 'success',
        data: requestedUser
    });
});