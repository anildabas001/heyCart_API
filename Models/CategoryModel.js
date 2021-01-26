const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   name: {
        type: String,
        required: [true, 'Category must have a name'],
        unique: true,
        lowercase: true,
        minLength: 1,
        trim: true
   },
   title: {
       type: String,
       required: [true, 'Category must have a title'],
       lowercase: true,
       minLength: 1,
       trim: true
   },
   parentCategory: {
       type: String,
       lowercase: true,
       trim: true
   }   
},{toJSON: {virtuals: true, 
    transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
  }}, 
  toObject: {virtuals: true,
    transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
   }
}});

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