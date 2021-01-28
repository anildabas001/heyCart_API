const mongoose = require('mongoose');

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
                return emailRegex.isMatch(value);
           },
           message: 'Email must be valid'
       }
   },
   password: {
       type: String,
       required: [true, 'User must have password'],
       min: [6, 'length of password must be at least 6 character long' ],
       trim: true
   },
   role:{
        type: String,
        default: 'Customer',
        enum: ['Administrator', 'Customer']
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
        trim: true
   },
   active: {
       type: Boolean,
       default: true
   },
   createdAt: {
        type: String,
        default: new Date(Date.now()).toUTCString()
   },
   modifiedAt: {
        type: String
   },
   passwordUpdateToken: {
        updateToken: String,
        expiresAt: String
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



const user = mongoose.model('user', userSchema);

module.exports = user;