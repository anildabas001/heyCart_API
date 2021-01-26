const product = require('../Models/CategoryModel');


module.exports.addCategory = (req, res, next) => {
    console.log(new Date("Tue, 26 Jan 2021 18:07:22 GMT"));
    console.log(req.body);
    product.create(req.body).then(data=>{       
        res.json(data);
    }).catch(err=> console.log(err))    
} 