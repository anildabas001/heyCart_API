const product = require('../Models/ProductModel');
const CatchAsync = require('../utility/CatchAsync');

module.exports.getProducts = CatchAsync(async(req, res, next) => {
    const productList = await product.find();
    
    res.status(200).json({
        status: 'success',
        data: productList
    });
});

module.exports.addProduct = CatchAsync(async(req, res, next) => {
    const body = req.body;
    const addedproduct = await product.create({
        name: body.name,
        description: body.description,
        mrp: body.mrp,
        brand: body.brand,
        categories: body.categories,
        images: body.images,
        primaryImage: body.primaryImage,
        quantity: body.quantity,
        foodPreferance: body.foodPreferance,
        organic: body.organic,
        variants: body.variants,
        stockQuantity: body.stockQuantity,
        purchaseLimit: body.purchaseLimit
    });
    return res.status(201).json({
        status: 'success',
        data: addedproduct
    });
});



module.exports.getProduct = CatchAsync(async(req, res, next) => {});

module.exports.updateProduct = CatchAsync(async(req, res, next) => {});

module.exports.deleteProduct = CatchAsync(async(req, res, next) => {});