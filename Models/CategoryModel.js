const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   categoryName: {
       type: String,
       required: [true, 'Please provide the name of the category'],
       unique: true,
       lowercase: true
   },
   subCategories: [{
       type: String,
       required: [true, 'Please provide the sub-category'],
       lowercase: true
   }       
   ]
});

const category = mongoose.model('category', categorySchema);

module.exports = category;