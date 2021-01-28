const user = require('../Models/UserModel');
const CatchAsync = require('../utility/CatchAsync');
const jwt = require('jsonwebtoken');
// const ApiFeature = require('../utility/ApiFeature');

module.exports.signupUser = CatchAsync(async(req, res, next) => {});

module.exports.loginUser = CatchAsync(async(req, res, next) => {});

module.exports.modifyUser = CatchAsync(async(req, res, next) => {});

module.exports.deactivteUser = CatchAsync(async(req, res, next) => {});

module.exports.getUsers = CatchAsync(async(req, res, next) => {});

module.exports.getUser = CatchAsync(async(req, res, next) => {});