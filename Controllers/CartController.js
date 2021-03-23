const user = require('../Models/UserModel');
const CatchAsync = require('../utility/CatchAsync');

const sendUpdatedCart = async (req, res, next) => {
    const cartUser = await user.findOne({_id: req.user.id}, {cart: 1}).populate({path: 'cart.products.product', select: 'name brand price stockQuantity quantity, id'});  
    const cart = cartUser.cart;

    if (cart && cart.products.length > 0) {
        res.statusCode = 200;
        res.send({
            status: 'success',
            data: cart
        });
    }    
    else {
        res.statusCode = 200;
        res.send({
            status: 'success',
            data: null
        });
    }
}

module.exports.fetchCart = CatchAsync(async (req, res, next) => {
    sendUpdatedCart(req, res, next);
});

module.exports.updateCart = CatchAsync(async (req, res, next) => {
    const cartUser = await user.findOne({_id: req.user.id}, {cart: 1});
    const cart = cartUser.cart;
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    let productFound = false;
    let indexToRemove = -1;

     if (!cart) {
         cartUser.cart={
            products: [],
            totalQuantity: 0,
            totalPrice: 0
         };
     }    
    // else if(cart.products.length === 0) {
    //     cartUser.cart.products.push({ productId, quantity});
    // }
    //else {
    //}

    if (quantity > 0) {
        cartUser.cart.products.forEach(productOne => {
            if(productOne.product.equals(productId)) {
                productFound = true;
                productOne.quantity = quantity;
            }
        })

        if(! productFound) {
            cartUser.cart.products.push({ product: productId, quantity});
        }
    }
    else {
        cartUser.cart.products.forEach((productOne,index) => {
            if(productOne.product.equals(productId)) {
                
                productFound = true;
                indexToRemove = index;
            }
        })

        if(productFound && indexToRemove >= 0) {
            cartUser.cart.products = [...cartUser.cart.products.splice(0, indexToRemove)];
        }
    }  

    const updatedCart = await cartUser.save();     
    sendUpdatedCart(req, res, next);

});