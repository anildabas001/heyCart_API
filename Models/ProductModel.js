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
            lowercase: true
        }
    ],
    images:[
        {
            type: String,
            required: [true, 'please enter the image details']
        }        
    ],
    primaryImage: {
        type: String,
        required: [true, 'please enter the primary image']
    },
    quantity: {
        value: {
            type: Number,
            required: [true, 'please enter the quantity value of the product']
        },
        unit: {
            type: Number,
            required: [true, 'please enter the quantity unit of the product']
        }
    },
    variants: [
        {
            type: ObjectId,
            ref: 'product'
        }
    ],
    organic: {
        type: String,
        enum:['yes','No'],
        default: 'NA'
    },
    foodPreferance: {
        type: String,
        enum:['Vegetarian','Non-Vegitarian, vegan'],
        equired: [true, 'please enter the food preferance of the product']
    },
    stockQuantity: {
        type: Number,
        min:0,       
        required: [true, 'Please provide the number of products in stock'],
    },
    purchaseLimit: {
     type: Number,
     min: 1
    }
},{toJSON: true, toObject: true});

productSchema.pre('save', function(next) {
    if(!this.price.value) {
        this.price.value = this.mrp.value;
    }
    next();
});

productSchema.virtual('discount').get(function() {
    if(this.price.value !== this.mrp.value) {
        return (this.mrp.value - this.price.value)* 100/ this.mrp.value;
    }
})

productSchema.pre('save', function(next) {
    this.categories.forEach(cat => {
        category.find({name: cat.toLowerCase()})
        .then(data=> {
            if(data.length) {
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