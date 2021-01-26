const product = require('../Models/CategoryModel');


module.exports.addCategory = (req, res, next) => {
    console.log(req.body);
    product.create(req.body).then(data=>{       
        res.json(data);
    }).catch(err=> console.log(err))    
} 