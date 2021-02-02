const product = require('../Models/ProductModel');
const category = require('../Models/CategoryModel');
const CatchAsync = require('../utility/CatchAsync');
const ApiFeature = require('../utility/ApiFeature');

module.exports.setCategories = CatchAsync(async(req, res, next) => {
    const parentCategory = req.params.category;
    const categories = await category.find({parentCategory: parentCategory}, {name: 1});
    req.query.categories = categories.map(catItem => catItem.name).join(',');
    
    next();

});

module.exports.getProducts = CatchAsync(async(req, res, next) => {
    const apiFilters = new ApiFeature(product.find({}), req.query);
    const productList = await apiFilters.filter().select().sort().paginate().executeQuery(); 

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
        price: body.price,
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



module.exports.getProduct = CatchAsync(async(req, res, next) => {
    const id = req.params.id;
    const apiFilters = new ApiFeature(product.find({_id: id}), req.query);
    const groceryItem = await apiFilters.select().sort().executeQuery();

    res.status(200).json({
        status: 'success',
        data: groceryItem
    });
});

module.exports.updateProduct = CatchAsync(async(req, res, next) => {
    const id = req.params.id;
    let itemToUpdate = await product.find({_id: id});
    itemToUpdate = itemToUpdate[0];
    const fieldsInfo  = ['name', 'description', 'mrp', 'brand', 'categories', 'images', 'primaryImage', 'quantity', 'foodPreferance', 'organic', 'variants', 'stockQuantity', 'purchaseLimit'];
    
    Object.keys(req.body).forEach(key => {
        if(fieldsInfo.findIndex(field => field === key) >= 0) {            
            itemToUpdate[key] = req.body[key]
        }
    });

    const updatedProduct = await itemToUpdate.save();

    console.log(updatedProduct);
    res.status(200).json({
        status: 'success',
        data: updatedProduct
    });
});

module.exports.deleteProduct = CatchAsync(async(req, res, next) => {
    const id = req.params.id;
    const deleted = await product.findByIdAndDelete(id);
    
    res.status(204).json({
        status: 'success',
        data: null
    });
});