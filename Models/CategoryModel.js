const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   name: {
        type: String,
        required: [true, 'Please provide the name of the category'],
        unique: true,
        lowercase: true
   },
   title: {
       type: String,
       required: [true, 'Please provide the title of the category'],
       lowercase: true
   },
   parentCategory: {
       type: String,
       lowercase: true
   }   
},{toJSON: true, toObject: true});

categorySchema.virtual('path').get(function() {
    if(this.parentCategory) {
        return `${this.parentCategory}/${this.name}`;
    }
    else {
        return `${this.name}`;
    }
    
})

const category = mongoose.model('category', categorySchema);

module.exports = category;