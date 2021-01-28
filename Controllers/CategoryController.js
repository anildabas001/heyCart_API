const category = require('../Models/CategoryModel');
const CatchAsync = require('../utility/CatchAsync');
const ApiFeature = require('../utility/ApiFeature');
const { findByIdAndUpdate } = require('../Models/CategoryModel');


module.exports.addCategory = CatchAsync(async(req, res, next) => {
    const body = req.body;
    const addedCategory = await category.create({
        name: body.name,
        title: body.title,
        parentCategory: body.parentCategory        
    });
    return res.status(201).json({
        status: 'success',
        data: addedCategory
    }); 
});

module.exports.getCategories = CatchAsync(async(req, res, next) => {
    const apiFilters = new ApiFeature(category.find({}), req.query);
    const categoryList = await apiFilters.filter().select().sort().paginate().executeQuery(); 
    
    res.status(200).json({
        status: 'success',
        data: categoryList
    });   
});

module.exports.getCategory = CatchAsync(async(req, res, next) => {
    const id = req.params.id;
    const apiFilters = new ApiFeature(category.find({_id: id}), req.query);
    const singleCategory = await apiFilters.select().sort().executeQuery();

    res.status(200).json({
        status: 'success',
        data: singleCategory
    });
});

module.exports.updateCategory = CatchAsync(async(req, res, next) => {
    const id = req.params.id;
    const updatedCategory =  await category.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});

    res.status(200).json({
        status: 'success',
        data: updatedCategory
    });
});

module.exports.deleteCategory = CatchAsync(async(req, res, next) => {
    const id = req.params.id;
    const deleted = await category.findByIdAndDelete(id);
    
    res.status(204).json({
        status: 'success',
        data: null
    });   
});