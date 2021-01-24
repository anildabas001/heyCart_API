const mongoose = require('mongoose');
const category = require('../Models/CategoryModel');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the name of the product']
    },
    description: {
        type: String,
        required: [true, 'Please provide the description of the product']
    },
    mrp: {
        value: {
            type: Number,
            required: [true, 'Please provide the value in mrp']
        },
        symbol: {
            type: String,
            default: '$'
        }            
    },
    price: {
        value: {
            type: Number
        },
        symbol: {
            type: String,
            default: '$'
        }
    },
    brand: {
        type: String,
        required: ['Please provide the brand name of the product']
    },
    ratingsAverage: {
        type: Number,
        min: [0,'Average ratings must not be less than 0'],
        max: [5,'Average ratings must not be more than 5']
    },
    categories: [
        {
            type: [String],
            required: [true, 'Please provide Categories for the product'],
            lowercase: true
        }
    ]
});

productSchema.pre('save', function(next) {
    if(!this.price.value) {
        this.price.value = this.mrp.value;
    }
    next();
});

productSchema.pre('save', function(next) {
    this.categories.forEach(cat => {
        category.find({subCategories: cat.toLowerCase()})
        .then(data=> {
            if(data.length > 0) {
                next();
            }
            else{
                throw new Error('product category does not exist in the category list')
            }
        })
    });
});

const product = mongoose.model('product', productSchema);

module.exports = product;