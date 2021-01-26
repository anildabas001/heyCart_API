const mongoose = require('mongoose');
const category = require('../Models/CategoryModel');
const OperationalError = require('../utility/OperationalError');

const productSchema = new mongoose.Schema({   
    name: {
        type: String,        
        unique: true,
        required: [true, 'Product must have valid name'],
        minLength: 1,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Product must have description'],
        minLength: 1,
        trim: true,
    },
    mrp: {
        value: {
            type: Number,
            required: [true, 'Product must have mrp value'],
            min: [0, 'minimum mrp value must be more than 0']
        },
        symbol: {
            type: String,
            default: '$'
        }            
    },
    price: {
        value: {
            type: Number,
            min: 0
        },
        symbol: {
            type: String,
            default: '$'
        }
    },
    brand: {
        type: String,
        required: ['Product must have a brand'],
        minLength: 1,
        trim: true
    },
    ratingsAverage: {
        type: Number,
        min: [0,'Average ratings must not be less than 0'],
        max: [5,'Average ratings must not be more than 5']
    },
    categories: {
            type: [String], 
            validate: {
                validator: function(value) {return Array.isArray(value) && value.length > 0;},
                message: 'product categories must not be empty'
            }            
    },
    images:{
        type: [String],
        validate: {
            validator: function(value) {return Array.isArray(value) && value.length > 0;},
            message: 'product images must not be empty'
        } 
    },
    primaryImage: {
        type: String,
        required: [true, 'Product must have a primary image'],
        validate: {
            validator: function(value) {
                if(!this.images.find(img => img === value)){
                    return false;
                }
                    else {
                        return true;
                    }
            },
            message: 'primary Image must be in images list'
        }
    },
    quantity: {
        value: {
            type: Number,
            required: [true, 'Product must have quantity value']
        },
        unit: {
            type: String,
            required: [true, 'Product must have quantity unit'],
            minLength: 1,
            trim: true
        }
    },
    variants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            validate: {
                validator: function(value) {
                    console.log(!(value && mongoose.Types.ObjectId.isValid(value)));
                    if(!(value && mongoose.Types.ObjectId.isValid(value))) {
                        return false;
                    }    
                    else{
                        return true;
                    }                
                },
                message: 'Variants must have valid values'
            }
        }
    ],
    organic: {
        lowercase: true,
        type: String,
        enum:['yes','no'],
        default: 'NA'
    },
    foodPreferance: {
        lowercase: true,
        type: String,
        enum:['vegetarian','non-vegitarian', 'vegan'],
        required: [true, 'Product must have food preferance']
    },
    stockQuantity: {
        type: Number,
        min:0,       
        required: [true, 'Product must have stock quantity'],
    },
    purchaseLimit: {
     type: Number,
     min: 1
    },
    createdAt:{
        type: Date,
        default: Date.now
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

productSchema.pre('save', function(next) {
    if(!this.price.value) { 
        this.price.value = this.mrp.value;
    }
    next();
});

productSchema.pre(/^find/, function(next) {    
    this.find().populate({
        path: 'variants'
        // Get friends of friends - populate the 'friends' array for every friend
        });
    next();

});

productSchema.virtual('discount').get(function() {
    if(this.price.value !== this.mrp.value) {
        return (this.mrp.value - this.price.value)* 100/ this.mrp.value;
    }
    else {
        return null;
    }
})

productSchema.pre('save', function(next) {    
    if(Array.isArray(this.categories) && this.categories.length > 0) {
        this.categories.forEach(cat => {
            category.find({name: cat.toLowerCase()})
            .then(data=> {
                if(data.length) {
                    next();
                }
                else{
                    next(new OperationalError('Invalid Data', 400, 'fail','product category does not exist in the category list'));
                }
            })
        });
    }
    else {
        next(new OperationalError('Invalid Data', 400, 'fail','product category must not be empty'));
    }
    
});

const product = mongoose.model('product', productSchema);

module.exports = product;