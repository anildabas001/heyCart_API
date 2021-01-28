const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
   name: {
        type: String,
        required: [true, 'User must have a name'],
        minLength: 1,
        trim: true
   },
   email: {
       type: String,
       required: [true, 'User must have an email'],
       lowercase: true,
       minLength: 1,
       trim: true,
       validate: {
           validator: function(value) {
                var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(value);
           },
           message: 'Email must be valid'
       },
       unique: true
   },
   password: {
       type: String,
       required: [true, 'User must have password'],
       min: [6, 'length of password must be at least 6 character long' ],
       trim: true,
       select: false
   },
   role:{
        type: String,
        default: 'Customer',
        enum: ['Administrator', 'Customer'],
        select: false
    },
   confirmPassword: {
        type: String,
        required: [true, 'Confirm Password field must not be left empty'],
        validate: {
            validator: function(value) {
                return this.password === value;
            },
            message: 'Confirm Password field must be matching with the password field'
        },
        trim: true,
        select: false
   },
   active: {
       type: Boolean,
       default: true,
       select: false
   },
   createdAt: {
        type: String,
        default: new Date(Date.now()).toUTCString(),
        select: false
   },
   modifiedAt: {
        type: String,
        select: false
   },
   passwordUpdateToken: {
        updateToken: String,
        expiresAt: String,
        select: false
   }
},{toJSON: {virtuals: true, 
    transform: function(doc, ret) {
        delete ret.id;
        delete ret._id;
  }}, 
  toObject: {virtuals: true,
    transform: function(doc, ret) {
        delete ret._id;
        delete ret.id;
   }
}});

userSchema.methods.verifyPassword = async function(userPassword) {
    console.log('reached');
    return await bcrypt.compareSync(userPassword, this.password)
};


userSchema.pre('save', async function(next) {
    this.confirmPassword = undefined;
    if(this.password) {
        this.password = await bcrypt.hash(this.password, Number(process.env['SALT_ROUNDS']));
    }    
    
    next();
});

const user = mongoose.model('user', userSchema);

module.exports = user;