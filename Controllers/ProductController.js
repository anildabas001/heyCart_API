const product = require('../Models/ProductModel');


module.exports.addProduct = (req, res, next) => {
    product.create(req.body).then(data=>{
        res.json(data);
    }).catch(err=> console.log(err))    
} 